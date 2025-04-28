import { Router } from "express";
import {
  createCard,
  getCards,
  updateCard,
  deleteCard,
  moveCard,
  reorderCards,
} from "../controllers/cardController.js";
import {verifyToken} from "../middleware/auth.js";


const router = Router({ mergeParams: true });

router.use(verifyToken);

router.get("/", getCards);

router.post("/", createCard);

router.patch('/reorder', reorderCards);

router.put("/:cardId", updateCard);

router.delete("/:cardId", deleteCard);

// router.patch('/boards/:boardId/cards/:cardId/move', moveCard);
router.patch('/:cardId/move', moveCard);


export default router;
