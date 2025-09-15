"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = require("./auth/authRoutes");
require("./ws/wsServer"); // Import the WS server file so it runs
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// HTTP routes for login/signup
app.use("/auth", authRoutes_1.authRoutes);
app.listen(3000, () => console.log("HTTP server running on port 3000"));
