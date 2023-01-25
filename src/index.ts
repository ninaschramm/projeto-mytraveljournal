import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/index';
dotenv.config()

const server = express();
server.use(cors());
server.use(express.json());

server.use(router)

export default server;