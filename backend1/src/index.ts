import express from "express";
import { authRoutes } from "./auth/authRoutes";
import "./ws/wsServer"; // Import the WS server file so it runs
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

// HTTP routes for login/signup
app.use("/auth", authRoutes);

app.listen(3000, () => console.log("HTTP server running on port 3000"));
