import express, {Express} from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'reflect-metadata';

import {errorHandler} from "./middlewares/error-handler.middleware";
import userRoutes from "./routes/user.route"
import authRoutes from "./routes/auth.route"
import notebookRoutes from "./routes/notebook.route";
import noteRoutes from "./routes/note.route";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // This allows cookies to be sent with requests
}));

app.use(helmet());
app.use(cookieParser());
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))

app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/notebooks', notebookRoutes)
app.use('/api/notes', noteRoutes)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});