import express from 'express';
import {
  createColumn,
  getColumnsByBoard,
  getColumnById,
  updateColumn,
  deleteColumn,
} from '../controllers/columnController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router.post('/',    createColumn);
router.get('/',     getColumnsByBoard);
router.get('/:id',  getColumnById);
router.put('/:id',  updateColumn);
router.delete('/:id', deleteColumn);


export default router;
