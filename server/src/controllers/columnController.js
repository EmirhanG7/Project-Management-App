import { db } from '../db/index.js';
import {boards, columns} from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function createColumn(req, res) {
  const { title, order } = req.body;
  const boardId = Number(req.params.boardId);
  if (!title) return res.status(400).json({ error: 'Title gerekli.' });

  const [parent] = await db
    .select()
    .from(boards)
    .where(eq(boards.id, boardId));

  if (!parent) {
    return res.status(404).json({ error: 'Bu board bulunamadı.' });
  }

  const [column] = await db
    .insert(columns)
    .values({ title, boardId, order: order ?? 0 })
    .returning();

  res.status(201).json(column);
}

export async function getColumnsByBoard(req, res) {
  const boardId = Number(req.params.boardId);
  const list = await db
    .select()
    .from(columns)
    .where(eq(columns.boardId, boardId))
    .orderBy(columns.order);

  res.json(list);
}

export async function getColumnById(req, res) {
  const id = Number(req.params.id);
  const [column] = await db
    .select()
    .from(columns)
    .where(eq(columns.id, id));

  if (!column) return res.status(404).json({ error: 'Column bulunamadı.' });
  res.json(column);
}

export async function updateColumn(req, res) {
  const id = Number(req.params.id);
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Başlık gerekli.' });

  const result = await db
    .update(columns)
    .set({ title })
    .where(eq(columns.id, id))
    .returning();

  if (!result.length) return res.status(404).json({ error: 'Column bulunamadı.' });
  res.json(result[0]);
}

export async function deleteColumn(req, res) {
  const id = Number(req.params.id);

  const [column] = await db
    .select()
    .from(columns)
    .where(eq(columns.id, id));

  if (!column) return res.status(404).json({ error: 'Column bulunamadı.' });

  await db
    .delete(columns)
    .where(eq(columns.id, id));

  res.status(200).json({ message: 'Column silindi.', column });
}
