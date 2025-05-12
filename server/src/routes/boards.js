import express from 'express';
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
  inviteToBoard,
  acceptInvite,
} from '../controllers/boardController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

router.post('/:boardId/invite', inviteToBoard)
router.get('/invitations/accept', acceptInvite)



export default router;
