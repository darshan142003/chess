import { Router } from "express";
import { login, signup, verify } from "./authController";

export const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/verify", verify); // Optional route to verify token
