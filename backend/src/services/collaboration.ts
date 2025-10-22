const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Simple logger fallback
const logger = {
    info: (msg: string) => console.log(`[INFO] ${msg}`),
    error: (msg: string, err?: any) => console.error(`[ERROR] ${msg}`, err)
};

// Simple redis client fallback
const redisClient = {
    lPush: (key: string, value: string) => Promise.resolve(),
    lTrim: (key: string, start: number, end: number) => Promise.resolve()
};

interface CollaborationSession {
    projectId: string;
    participants: {
        userId: string;
        socketId: string;
        cursor?: { x: number; y: number };
        selection?: string;
    }[];
}

const activeSessions = new Map<string, CollaborationSession>();

export const collaborationHandler = (io: any) => {
    // Authentication middleware for socket connections
    io.use(async (socket: any, next: any) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            socket.userId = decoded.userId;
            socket.userEmail = decoded.email;

            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket: any) => {
        logger.info(`User connected: ${socket.userId} (${socket.id})`);

        // Join user to their personal room for notifications
        socket.join(`user:${socket.userId}`);

        // Join project collaboration
        socket.on('join-project', (projectId: string) => {
            try {
                // Leave previous project rooms
                const rooms = Array.from(socket.rooms) as string[];
                rooms.forEach((room: string) => {
                    if (room.startsWith('project:')) {
                        socket.leave(room);
                    }
                });

                // Join new project room
                const roomName = `project:${projectId}`;
                socket.join(roomName);
                socket.currentProject = projectId;

                // Update session
                let session = activeSessions.get(projectId);
                if (!session) {
                    session = {
                        projectId,
                        participants: []
                    };
                    activeSessions.set(projectId, session);
                }

                // Add or update participant
                const existingParticipant = session.participants.find(p => p.userId === socket.userId);
                if (existingParticipant) {
                    existingParticipant.socketId = socket.id;
                } else {
                    session.participants.push({
                        userId: socket.userId,
                        socketId: socket.id
                    });
                }

                // Notify other participants
                socket.to(roomName).emit('user-joined', {
                    userId: socket.userId,
                    email: socket.userEmail
                });

                // Send current participants to new user
                socket.emit('participants-update', {
                    participants: session.participants.map(p => ({
                        userId: p.userId,
                        cursor: p.cursor,
                        selection: p.selection
                    }))
                });

                logger.info(`User ${socket.userId} joined project ${projectId}`);
            } catch (error) {
                logger.error('Join project error:', error);
                socket.emit('error', { message: 'Failed to join project' });
            }
        });

        // Handle canvas operations (CRDT-like)
        socket.on('canvas-operation', (data: any) => {
            try {
                if (!socket.currentProject) return;

                const roomName = `project:${socket.currentProject}`;

                // Broadcast operation to other participants
                socket.to(roomName).emit('canvas-operation', {
                    ...data,
                    userId: socket.userId,
                    timestamp: Date.now()
                });

                // Store operation in Redis for persistence (optional)
                const operationKey = `project:${socket.currentProject}:operations`;
                redisClient.lPush(operationKey, JSON.stringify({
                    ...data,
                    userId: socket.userId,
                    timestamp: Date.now()
                })).catch(console.error);

                // Keep only last 100 operations
                redisClient.lTrim(operationKey, 0, 99).catch(console.error);
            } catch (error) {
                logger.error('Canvas operation error:', error);
            }
        });

        // Handle cursor movement
        socket.on('cursor-move', (data: { x: number; y: number }) => {
            try {
                if (!socket.currentProject) return;

                const session = activeSessions.get(socket.currentProject);
                if (session) {
                    const participant = session.participants.find(p => p.userId === socket.userId);
                    if (participant) {
                        participant.cursor = data;
                    }
                }

                const roomName = `project:${socket.currentProject}`;
                socket.to(roomName).emit('cursor-update', {
                    userId: socket.userId,
                    cursor: data
                });
            } catch (error) {
                logger.error('Cursor move error:', error);
            }
        });

        // Handle element selection
        socket.on('element-select', (elementId: string) => {
            try {
                if (!socket.currentProject) return;

                const session = activeSessions.get(socket.currentProject);
                if (session) {
                    const participant = session.participants.find(p => p.userId === socket.userId);
                    if (participant) {
                        participant.selection = elementId;
                    }
                }

                const roomName = `project:${socket.currentProject}`;
                socket.to(roomName).emit('selection-update', {
                    userId: socket.userId,
                    elementId
                });
            } catch (error) {
                logger.error('Element select error:', error);
            }
        });

        // Handle code changes
        socket.on('code-change', (data: { type: 'html' | 'css' | 'js'; content: string; cursor?: any }) => {
            try {
                if (!socket.currentProject) return;

                const roomName = `project:${socket.currentProject}`;
                socket.to(roomName).emit('code-change', {
                    ...data,
                    userId: socket.userId,
                    timestamp: Date.now()
                });
            } catch (error) {
                logger.error('Code change error:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            try {
                logger.info(`User disconnected: ${socket.userId} (${socket.id})`);

                if (socket.currentProject) {
                    const session = activeSessions.get(socket.currentProject);
                    if (session) {
                        // Remove participant
                        session.participants = session.participants.filter(p => p.socketId !== socket.id);

                        // Clean up empty sessions
                        if (session.participants.length === 0) {
                            activeSessions.delete(socket.currentProject);
                        }

                        // Notify other participants
                        const roomName = `project:${socket.currentProject}`;
                        socket.to(roomName).emit('user-left', {
                            userId: socket.userId
                        });
                    }
                }
            } catch (error) {
                logger.error('Disconnect error:', error);
            }
        });

        // Handle AI job status updates
        socket.on('ai-job-status', (jobId: string) => {
            try {
                // This would typically query the AI job status from database
                // For now, we'll emit a mock status
                socket.emit('ai-job-update', {
                    jobId,
                    status: 'processing',
                    progress: 50
                });
            } catch (error) {
                logger.error('AI job status error:', error);
            }
        });
    });

    return io;
};

// Utility functions
export const notifyUser = (io: any, userId: string, notification: any) => {
    io.to(`user:${userId}`).emit('notification', notification);
};

export const broadcastToProject = (io: any, projectId: string, event: string, data: any) => {
    io.to(`project:${projectId}`).emit(event, data);
};

export const getActiveParticipants = (projectId: string) => {
    const session = activeSessions.get(projectId);
    return session ? session.participants : [];
};