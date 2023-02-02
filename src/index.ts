import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes/index';
import { connectDb, disconnectDb } from '../prisma/prisma';
dotenv.config()

const server = express();
server.use(cors());
server.use(express.json());

server.use(router)

export function init(): Promise<Express> {
    connectDb();
    return Promise.resolve(server);
  }
  
  export async function close(): Promise<void> {
    await disconnectDb();
  }

export default server;