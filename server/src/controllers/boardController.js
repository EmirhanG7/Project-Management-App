import { db } from '../db/index.js';
import {boards, columns} from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function createBoard(req, res) {
  const { title } = req.body;
  const userId = req.userId;
  if (!title) return res.status(400).json({ error: 'Title gerekli.' });

  const [board] = await db
    .insert(boards)
    .values({ title, userId })
    .returning();
  res.status(201).json(board);
}

export async function getBoards(req, res) {
  const userId = req.userId;
  const list = await db
    .select()
    .from(boards)
    .where(eq(boards.userId, userId));
  res.json(list);
}

export async function getBoardById(req, res) {
  const { id } = req.params;
  const userId = req.userId;
  const [board] = await db
    .select()
    .from(boards)
    .where(
      eq(boards.id, Number(id)),
      eq(boards.userId, userId)
    );
  if (!board) return res.status(404).json({ error: 'Board bulunamadı.' });
  res.json(board);
}

export async function updateBoard(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.userId;
  const result = await db
    .update(boards)
    .set({ title })
    .where(
      eq(boards.id, Number(id)),
      eq(boards.userId, userId)
    )
    .returning();
  if (!result.length) return res.status(404).json({ error: 'Board bulunamadı.' });
  res.json(result[0]);
}

export async function deleteBoard(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  const [board] = await db
    .select()
    .from(boards)
    .where(
      eq(boards.id, id),
      eq(boards.userId, userId)
    );

  if (!board) {
    return res.status(404).json({ error: 'Board bulunamadı.' });
  }

  await db
    .delete(boards)
    .where(
      eq(boards.id, id),
      eq(boards.userId, userId)
    );

  res.status(200).json({
    message: 'Board silindi.',
    board
  });
}
