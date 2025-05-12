import { db } from '../db/index.js';
import {boardInvitations, boardMembers, boards, columns, users} from '../db/schema.js';
import {eq, ne} from 'drizzle-orm';
import {sendMail} from "../utils/mailer.js";
import crypto from 'crypto'

export async function createBoard(req, res) {

  try {
    const { title } = req.body;
    const userId = req.userId;
    if (!title) return res.status(400).json({ error: 'Title gerekli.' });

    const [board] = await db
      .insert(boards)
      .values({ title, userId })
      .returning();

    await db.insert(boardMembers).values({
      boardId: board.id,
      userId,
      role: 'owner',
    })

    res.status(201).json(board);
  } catch (err) {
    console.error(err)
  }

}

export async function getBoards(req, res, next) {
  try {
    const userId = req.userId

    const own = await db
      .select()
      .from(boards)
      .where(eq(boards.userId, userId))

    const shared = await db
      .select({
        id:    boards.id,
        title: boards.title,
        userId: boards.userId,
      })
      .from(boards)
      .innerJoin(boardMembers, eq(boardMembers.boardId, boards.id))
      .where(
        eq(boardMembers.userId, userId),
        ne(boards.userId, userId)
      )

    res.json({ own, shared })
  } catch (err) {
    next(err)
  }
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


export async function inviteToBoard(req, res, next) {
  try {
    const inviterId = req.userId
    const boardId   = Number(req.params.boardId)
    const { email } = req.body

    const [ownerBoard] = await db
      .select()
      .from(boards)
      .where(
        eq(boards.id, boardId),
        eq(boards.userId, inviterId)
      )
    if (!ownerBoard) {
      return res.status(403).json({ error: 'Bu panoya davet gönderme yetkiniz yok.' })
    }

    const token     = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await db.insert(boardInvitations).values({
      boardId,
      email,
      token,
      expiresAt,
    })

    const [b] = await db
      .select({ title: boards.title })
      .from(boards)
      .where(eq(boards.id, boardId))

    const link = `${process.env.CORS_ORIGINS}/accept-invite?token=${encodeURIComponent(token)}`
    const html = `
      <p>Merhaba,</p>
      <p>Sizi <strong>${b.title}</strong> panosuna davet ettik.</p>
      <p>Katılmak için <a href="${link}">tıklayın</a> (7 gün geçerli).</p>
    `
    await sendMail({ to: email, subject: 'Pano Daveti', html })

    res.json({ message: 'Davet e-postası gönderildi.' })
  } catch (err) {
    next(err)
  }
}

export async function acceptInvite(req, res, next) {
  try {
    const userId = req.userId
    const token  = req.query.token

    const [inv] = await db
      .select()
      .from(boardInvitations)
      .where(eq(boardInvitations.token, token))

    if (!inv) {
      return res.status(400).json({ error: 'Geçersiz davet.' })
    }
    if (inv.accepted) {
      return res.status(400).json({ error: 'Davet zaten kabul edilmiş.' })
    }
    if (inv.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Davet süresi dolmuş.' })
    }

    const [u] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, userId))
    if (u.email !== inv.email) {
      return res.status(403).json({ error: 'Bu davet size ait değil.' })
    }

    await db.insert(boardMembers).values({
      boardId: inv.boardId,
      userId,
      role: 'member',
    })

    await db
      .update(boardInvitations)
      .set({ accepted: true })
      .where(eq(boardInvitations.id, inv.id))

    res.json({ message: 'Davet kabul edildi.', boardId: inv.boardId })
  } catch (err) {
    next(err)
  }
}