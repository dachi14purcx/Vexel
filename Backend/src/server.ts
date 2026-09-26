import 'dotenv/config'
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import cors from "cors"
import { errorMiddleware } from "./middleware/error.middleware.js";
import UserRouter from './routes/users.route.js';

export const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.all("/api/auth/*any", toNodeHandler(auth));

app.use(express.json());
app.use('/users', UserRouter)
app.use(errorMiddleware);