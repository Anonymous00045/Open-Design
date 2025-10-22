export declare const collaborationHandler: (io: any) => any;
export declare const notifyUser: (io: any, userId: string, notification: any) => void;
export declare const broadcastToProject: (io: any, projectId: string, event: string, data: any) => void;
export declare const getActiveParticipants: (projectId: string) => {
    userId: string;
    socketId: string;
    cursor?: {
        x: number;
        y: number;
    };
    selection?: string;
}[];
//# sourceMappingURL=collaboration.d.ts.map