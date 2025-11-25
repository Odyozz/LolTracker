"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Healthcheck (Render va souvent taper là-dessus)
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api', routes_1.default);
// Middleware d'erreur global
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// ⚠️ IMPORTANT : Render fournit PORT
const port = Number(process.env.PORT) ||
    Number(env_1.config.port) ||
    4000;
app.listen(port, () => {
    console.log(`🚀 Backend listening on http://localhost:${port}`);
});
