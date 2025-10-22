"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveParticipants = exports.broadcastToProject = exports.notifyUser = exports.collaborationHandler = void 0;
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg, err) => console.error(`[ERROR] ${msg}`, err)
};
const redisClient = {
    lPush: (key, value) => Promise.resolve(),
    lTrim: (key, start, end) => Promise.resolve()
};
const activeSessions = new Map();
const collaborationHandler = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            socket.userEmail = decoded.email;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        logger.info(`User connected: ${socket.userId} (${socket.id})`);
        socket.join(`user:${socket.userId}`);
        socket.on('join-project', (projectId) => {
            try {
                const rooms = Array.from(socket.rooms);
                rooms.forEach((room) => {
                    if (room.startsWith('project:')) {
                        socket.leave(room);
                    }
                });
                const roomName = `project:${projectId}`;
                socket.join(roomName);
                socket.currentProject = projectId;
                let session = activeSessions.get(projectId);
                if (!session) {
                    session = {
                        projectId,
                        participants: []
                    };
                    activeSessions.set(projectId, session);
                }
                const existingParticipant = session.participants.find(p => p.userId === socket.userId);
                if (existingParticipant) {
                    existingParticipant.socketId = socket.id;
                }
                else {
                    session.participants.push({
                        userId: socket.userId,
                        socketId: socket.id
                    });
                }
                socket.to(roomName).emit('user-joined', {
                    userId: socket.userId,
                    email: socket.userEmail
                });
                socket.emit('participants-update', {
                    participants: session.participants.map(p => ({
                        userId: p.userId,
                        cursor: p.cursor,
                        selection: p.selection
                    }))
                });
                logger.info(`User ${socket.userId} joined project ${projectId}`);
            }
            catch (error) {
                logger.error('Join project error:', error);
                socket.emit('error', { message: 'Failed to join project' });
            }
        });
        socket.on('canvas-operation', (data) => {
            try {
                if (!socket.currentProject)
                    return;
                const roomName = `project:${socket.currentProject}`;
                socket.to(roomName).emit('canvas-operation', {
                    ...data,
                    userId: socket.userId,
                    timestamp: Date.now()
                });
                const operationKey = `project:${socket.currentProject}:operations`;
                redisClient.lPush(operationKey, JSON.stringify({
                    ...data,
                    userId: socket.userId,
                    timestamp: Date.now()
                })).catch(console.error);
                redisClient.lTrim(operationKey, 0, 99).catch(console.error);
            }
            catch (error) {
                logger.error('Canvas operation error:', error);
            }
        });
        socket.on('cursor-move', (data) => {
            try {
                if (!socket.currentProject)
                    return;
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
            }
            catch (error) {
                logger.error('Cursor move error:', error);
            }
        });
        socket.on('element-select', (elementId) => {
            try {
                if (!socket.currentProject)
                    return;
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
            }
            catch (error) {
                logger.error('Element select error:', error);
            }
        });
        socket.on('code-change', (data) => {
            try {
                if (!socket.currentProject)
                    return;
                const roomName = `project:${socket.currentProject}`;
                socket.to(roomName).emit('code-change', {
                    ...data,
                    userId: socket.userId,
                    timestamp: Date.now()
                });
            }
            catch (error) {
                logger.error('Code change error:', error);
            }
        });
        socket.on('disconnect', () => {
            try {
                logger.info(`User disconnected: ${socket.userId} (${socket.id})`);
                if (socket.currentProject) {
                    const session = activeSessions.get(socket.currentProject);
                    if (session) {
                        session.participants = session.participants.filter(p => p.socketId !== socket.id);
                        if (session.participants.length === 0) {
                            activeSessions.delete(socket.currentProject);
                        }
                        const roomName = `project:${socket.currentProject}`;
                        socket.to(roomName).emit('user-left', {
                            userId: socket.userId
                        });
                    }
                }
            }
            catch (error) {
                logger.error('Disconnect error:', error);
            }
        });
        socket.on('ai-job-status', (jobId) => {
            try {
                socket.emit('ai-job-update', {
                    jobId,
                    status: 'processing',
                    progress: 50
                });
            }
            catch (error) {
                logger.error('AI job status error:', error);
            }
        });
    });
    return io;
};
exports.collaborationHandler = collaborationHandler;
const notifyUser = (io, userId, notification) => {
    io.to(`user:${userId}`).emit('notification', notification);
};
exports.notifyUser = notifyUser;
const broadcastToProject = (io, projectId, event, data) => {
    io.to(`project:${projectId}`).emit(event, data);
};
exports.broadcastToProject = broadcastToProject;
const getActiveParticipants = (projectId) => {
    const session = activeSessions.get(projectId);
    return session ? session.participants : [];
};
exports.getActiveParticipants = getActiveParticipants;
//# sourceMappingURL=collaboration.js.map