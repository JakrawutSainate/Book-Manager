// src/app.ts
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import bookRoutes from './routes/bookRoutes'

import { notFound } from './middleware/notFound'
import { errorHandler } from './middleware/errorHandler'


export const createApp = () => {
  const app = express()
    app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))

 // security & performance
  app.use(helmet());
  app.use(compression());
  app.use(morgan('tiny'));

  // JSON parser
  app.use(express.json());

  // API/Book
  app.use('/api/books', bookRoutes)

  // health check
  app.get('/health', (req: Request, res: Response) => {
    res.send('OK')
  })


   // 404 & Error handlers
  app.use(notFound);
  app.use(errorHandler);

  return app
}
