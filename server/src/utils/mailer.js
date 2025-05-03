import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  throw new Error('Eksik SMTP ayarı! .env dosyanızı kontrol edin.');
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT, 10),
  secure: SMTP_PORT === '465',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

export async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `"projecttrelloclone@gmail.com" <${SMTP_USER}>`,
    to,
    subject,
    html,
  });
  console.log('Mail gönderildi:', info.messageId);
  return info;
}
