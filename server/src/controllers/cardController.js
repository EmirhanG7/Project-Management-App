import { db } from '../db/index.js';
import {cards, columns} from '../db/schema.js';
import { eq } from 'drizzle-orm';

export async function createCard(req, res) {
  const { title } = req.body;
  const { columnId } = req.params;

  const existingCards = await db
    .select()
    .from(cards)
    .where(eq(cards.columnId, Number(columnId)));

  const nextOrder = existingCards.length;

  const [card] = await db
    .insert(cards)
    .values({ title, order: nextOrder, columnId: Number(columnId) })
    .returning();

  res.status(201).json(card);
}


export async function getCards(req, res) {
  const { columnId } = req.params;

  const list = await db
    .select()
    .from(cards)
    .where(eq(cards.columnId, Number(columnId)))

  res.json(list);
}

export async function updateCard(req, res) {
  const { columnId, cardId } = req.params;
  const { title, order } = req.body;

  const [updated] = await db
    .update(cards)
    .set({ title, order })
    .where(eq(cards.id, Number(cardId)))
    .returning();

  if (!updated) {
    return res.status(404).json({ error: "Card bulunamadı." });
  }

  res.json(updated);
}

export async function deleteCard(req, res) {
  const { columnId, cardId } = req.params;

  const [deleted] = await db
    .delete(cards)
    .where(eq(cards.id, Number(cardId)))
    .returning();

  if (!deleted) {
    return res.status(404).json({ error: "Card bulunamadı." });
  }

  res.json({ message: "Card silindi.", card: deleted });
}

export async function moveCard(req, res) {
  try {
    const { boardId, cardId } = req.params;
    const { newColumnId, order } = req.body;

    // console.log('MOVE CARD API - Params:', req.params);
    // console.log('MOVE CARD API - Body:', req.body);

    if (!newColumnId || isNaN(newColumnId)) {
      console.log('MOVE CARD API - HATA: Geçersiz newColumnId');
      return res.status(400).json({ error: 'newColumnId geçersiz.' });
    }

    if (order === undefined || isNaN(order)) {
      console.log('MOVE CARD API - HATA: Geçersiz order');
      return res.status(400).json({ error: 'order geçersiz.' });
    }

    const targetColumn = await db
      .select()
      .from(columns)
      .where(eq(columns.id, Number(newColumnId)));

    if (!targetColumn.length) {
      console.log('MOVE CARD API - HATA: Hedef kolon bulunamadı');
      return res.status(404).json({ error: 'Hedef kolon bulunamadı.' });
    }


    const [card] = await db
      .select()
      .from(cards)
      .where(eq(cards.id, Number(cardId)));

    if (!card) {
      console.log('MOVE CARD API - HATA: Kart bulunamadı');
      return res.status(404).json({ error: 'Kart bulunamadı.' });
    }

    console.log('MOVE CARD API - Kart bulundu:', card);

    const result = await db
      .update(cards)
      .set({
        columnId: Number(newColumnId),
        order: Number(order),
      })
      .where(eq(cards.id, Number(cardId)))
      .returning();

    console.log('MOVE CARD API - Güncelleme sonucu:', result);

    res.json({ message: 'Kart başarıyla taşındı ve sıralandı.' });
  } catch (error) {
    console.error('MOVE CARD API - Bir hata oluştu:', error);
    res.status(500).json({ error: 'Kart taşınırken bir hata oluştu.' });
  }
}


export async function reorderCards(req, res) {
  const { columnId } = req.params;
  const cardsList = req.body;

  if (!Array.isArray(cardsList)) {
    return res.status(400).json({ error: 'Kart listesi eksik veya hatalı.' });
  }

  try {
    for (const card of cardsList) {
      await db.update(cards)
        .set({ order: card.order })
        .where(eq(cards.id, card.id));
    }

    res.json({ message: "Kartlar başarıyla yeniden sıralandı." });
  } catch (error) {
    console.error("REORDER API ERROR:", error);
    res.status(500).json({ error: "Kartları güncellerken hata oluştu." });
  }
}
