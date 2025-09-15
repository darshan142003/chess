"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const authController_1 = require("./authController");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/signup", authController_1.signup);
exports.authRoutes.post("/login", authController_1.login);
exports.authRoutes.get("/verify", authController_1.verify); // Optional route to verify token
