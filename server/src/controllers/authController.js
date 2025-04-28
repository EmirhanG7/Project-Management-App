import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Eksik alan var.' });
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existing.length) {
    return res.status(409).json({ error: 'Bu email zaten kullanılıyor.' });
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash: hash, name })
    .returning();

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, email, name } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Eksik alan var.' });
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (!user) {
    return res.status(401).json({ error: 'Email veya şifre yanlış.' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Email veya şifre yanlış.' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

export async function me(req, res) {
  const { userId } = req;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  res.json({ user: { id: user.id, email: user.email, name: user.name } });
}
