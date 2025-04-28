import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import boardsRoutes from './routes/boards.js';
import columnsRoutes from './routes/columns.js';
import cardsRoutes from "./routes/cards.js";

dotenv.config();
const app = express();
app.use(cors(), express.json());

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardsRoutes);
app.use('/api/boards/:boardId/columns', columnsRoutes);
app.use('/api/boards/:boardId/columns/:columnId/cards', cardsRoutes);


// Test endpoint
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
