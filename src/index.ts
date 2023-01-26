import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/index';
dotenv.config()

const server = express();
server.use(cors());
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
server.use(express.json());

server.use(router)

export default server;