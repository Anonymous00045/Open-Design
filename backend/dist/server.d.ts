import { Server } from 'socket.io';
declare const app: import("express-serve-static-core").Express;
declare const io: Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare const redisClient: {
    connect: () => Promise<void>;
    lPush: () => Promise<void>;
    lTrim: () => Promise<void>;
};
export { app, io };
//# sourceMappingURL=server.d.ts.map