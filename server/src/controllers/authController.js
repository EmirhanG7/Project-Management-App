import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  path: '/',
};

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

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const [user] = await db
    .insert(users)
    .values({ email, passwordHash, name })
    .returning();

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res
    .cookie('accessToken', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(201)
    .json({ user: { id: user.id, email, name } });
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

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Email veya şifre yanlış.' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res
    .cookie('accessToken', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({ user: { id: user.id, email: user.email, name: user.name } });
}

export async function me(req, res) {
  const { userId } = req;
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  }

  res.json({ user: { id: user.id, email: user.email, name: user.name } });
}

export function logout(req, res) {
  res.clearCookie('accessToken', { path: '/' });
  res.json({ success: true });
}
