import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';

import authRoutes from './routes/auth.js';
import boardsRoutes from './routes/boards.js';
import columnsRoutes from './routes/columns.js';
import cardsRoutes from './routes/cards.js';
import csrfRoutes from './routes/csrf.js';

import { handleCsrfError } from './middleware/csrfErrorHandler.js';
import { handleGeneralError } from './middleware/errorHandler.js';

dotenv.config();
const app = express();

const CORS_ORIGINS = process.env.CORS_ORIGINS;

app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true
}));

app.use(cookieParser());

app.use(csurf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict'
  },
  ignoreMethods: ['GET','HEAD','OPTIONS']
}));

app.use(express.json());

app.use('/api/csrf-token', csrfRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardsRoutes);
app.use('/api/boards/:boardId/columns', columnsRoutes);
app.use('/api/boards/:boardId/columns/:columnId/cards', cardsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

app.use(handleCsrfError);
app.use(handleGeneralError);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
