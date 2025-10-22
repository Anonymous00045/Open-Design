"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.communityRoutes = router;
const submissions = [
    {
        id: '1',
        title: 'Modern Button Collection',
        description: 'Beautiful animated buttons',
        rating: { up: 15, down: 2 }
    }
];
router.get('/submissions', auth_1.optionalAuth, async (req, res) => {
    try {
        res.json({ submissions, message: 'Community endpoint working' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
//# sourceMappingURL=community.js.map