// ============================== This file for entry point of app and middlewares =========

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import Connection from './database/Connection.js';
const app = express();
const port = process.env.PORT || 8000;

// Import routes
import userRouter from './routes/user.route.js';
import contactRouter from './routes/contact.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js';
import profileRouter from './routes/profile.route.js';
import socketSetup from './socket.connection.js';
import statusRouter from './routes/status.route.js';
import contactNotSaved from './routes/contactsNotSaved.route.js';


app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Set up routes
app.use("/user", userRouter);
app.use("/contact", contactRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);
app.use("/profile", profileRouter);
app.use("/status", statusRouter);
app.use("/contact", contactNotSaved);

// Root route
app.get('/', (req, res) => {
    res.send("Server is ready");
});

const server = http.createServer(app);
socketSetup(server)


Connection().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(() => {
    console.log('Error in DB connect');
});

export { app };
