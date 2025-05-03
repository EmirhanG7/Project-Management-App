import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { sendMail } from '../utils/mailer.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Eksik alan var.' });
    }

    const existing = await db.select()
      .from(users)
      .where(eq(users.email, email));
    if (existing.length) {
      return res.status(409).json({ error: 'Bu email zaten kullanılıyor.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const verificationToken = await bcrypt.genSalt(SALT_ROUNDS);
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [user] = await db.insert(users)
      .values({
        email,
        passwordHash,
        name,
        verificationToken,
        tokenExpiresAt,
      })
      .returning();

    const verifyUrl = `${process.env.CORS_ORIGINS}/verify-email?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;

    const html = `
      <p>Merhaba ${name},</p>
      <p>Hesabınızı aktifleştirmek için <a href="${verifyUrl}">tıklayın</a>.</p>
      <p>Bu link 24 saat için geçerli.</p>
    `;
    await sendMail({ to: email, subject: 'E-posta Doğrulama', html });

    return res
      .status(201)
      .json({ message: 'Kayıt başarılı. Lütfen e-postanızı kontrol edip doğrulayın.' });
  } catch (err) {
    console.error('Register error:', err);
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'Token eksik.' });
    }

    const decodedToken = decodeURIComponent(token);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, decodedToken));

    if (!user) {
      return res.status(400).json({ error: 'Geçersiz veya kullanılmış token.' });
    }

    if (user.tokenExpiresAt && new Date(user.tokenExpiresAt) < new Date()) {
      return res.status(400).json({ error: 'Token süresi dolmuş.' });
    }

    await db
      .update(users)
      .set({
        emailVerified: true,
        verificationToken: null,
        tokenExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    return res.json({ message: 'E-posta başarılı şekilde doğrulandı. Giriş yapabilirsiniz.' });
  } catch (err) {
    console.error('verifyEmail error:', err);
    next(err);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Eksik alan var.' });
  }

  const [user] = await db
    .select().from(users).where(eq(users.email, email));
  if (!user) {
    return res.status(401).json({ error: 'Email veya şifre yanlış.' });
  }
  if (!user.emailVerified) {
    return res
      .status(403)
      .json({ error: 'Lütfen önce e-postanızı doğrulayın.' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Email veya şifre yanlış.' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res
    .cookie('accessToken', token, { ...cookieOptions, maxAge: 7*24*60*60*1000 })
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


export async function resendVerification(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'E-posta eksik.' });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }
    if (user.emailVerified) {
      return res.status(400).json({ error: 'E-posta zaten doğrulanmış.' });
    }

    const verificationToken = await bcrypt.genSalt(SALT_ROUNDS);
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db
      .update(users)
      .set({ verificationToken, tokenExpiresAt })
      .where(eq(users.id, user.id));

    const origin = process.env.CORS_ORIGINS.replace(/\/$/, '');
    const verifyUrl = `${origin}/verify-email?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;
    const html = `
      <p>Merhaba ${user.name},</p>
      <p>Yeni doğrulama linki için <a href="${verifyUrl}">tıklayın</a>.</p>
      <p>Bu link 24 saat için geçerli.</p>
    `;
    await sendMail({ to: email, subject: 'Doğrulama Maili Yenilendi', html });

    return res.json({ message: 'Yeni doğrulama maili gönderildi.' });
  } catch (err) {
    console.error('resendVerification error:', err);
    next(err);
  }
}
