# Project Management App

Trello ve Notion benzeri bir görev yönetim uygulamasıdır. Kullanıcılar kendi **panolarını** (boards), **listelerini** (columns) ve **kartlarını** (cards) oluşturabilir; kartları sürükle-bırak ile hem aynı listede hem de listeler arasında taşıyabilir ve sıralamasını güncelleyebilir.

---

## 🚀 Öne Çıkan Özellikler

- **Kullanıcı Yönetimi**
    - Kayıt & e-posta doğrulama (24 saat geçerli, tek kullanımlık token)
    - JWT tabanlı kimlik doğrulama; token, `HttpOnly`, `SameSite=Strict` cookie’de saklanır
    - Login, Logout ve “Ben Kimim?” (`/auth/me`) endpoint’leri

- **Güvenlik**
    - CSRF koruması: POST/PUT/PATCH/DELETE isteklerde `csurf` middleware ve `X-CSRF-Token` header
    - CORS: yalnızca `CORS_ORIGINS` altında izin verilen origin’lerden istek kabulü

- **Panolar & Ortak Çalışma**
    - Kişisel pano oluşturma, silme
    - Pano sahipleri e-posta ile üye davet edebilir (`/boards/:id/invite`)
    - Davet edilen kullanıcılar pane katılır, üye listesini görebilir

- **Listeler & Kartlar**
    - Board’a liste (column) ekleme, silme
    - Liste içinde kart (card) ekleme, silme
    - Kartları sürükle-bırak ile sıralama (`order`) ve kolonlar arası taşıma
    - Tüm değişiklikler backend’e anında yansır

- **Yorumlar**
    - Her karta yorum ekleme ve listeleme (`/cards/:cardId/comments`)

---

## 🔧 Kurulum & Çalıştırma

### 1. Repo’yu Klonlayın

```bash
git clone https://github.com/emirhang7/project-management-app.git
cd project-management-app
```

### 2. Backend (server/) Kurulumu

```bash
cd server
npm install
```

#### server/.env

```env
DATABASE_URL=postgresql://<kullanici>:<sifre>@localhost:5432/<veritabani>
JWT_SECRET=<jwt_secret_key>
PORT=4000

# SMTP (ör. Gmail App Password veya profesyonel SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<smtp_user_email>
SMTP_PASS=<smtp_app_password>

# Frontend origin ve verify-email linki için
CORS_ORIGINS=http://localhost:5173
```

```bash
npm run dev
```

- API base URL: `http://localhost:4000/api`

### 3. Frontend (client/) Kurulumu

```bash
cd ../client
npm install
# Peer-dependency çatışması olursa:
npm install --legacy-peer-deps
```

#### client/.env

```env
VITE_API_BASE=http://localhost:4000/api
```

```bash
npm run dev
```

- Uygulama URL: `http://localhost:5173`

---

## 🔄 E-Posta Doğrulama Akışı

1. **Kayıt (`POST /auth/register`)**
    - Kullanıcı bilgileri alınır, `verificationToken` ve `tokenExpiresAt` oluşturulur.
    - `verify-email?token=&email=` şeklinde link, e-posta ile gönderilir.

2. **Doğrulama (`GET /auth/verify-email`)**
    - Token ve e-posta kontrol edilir, `emailVerified` alanı `true` olur.
    - Başarılı doğrulama sonrası frontend’de kullanıcıya bilgi gösterilir.

3. **Yeniden Gönderme (`POST /auth/resend-verification`)**
    - Token süresi dolmuşsa ya da kullanıcı linki kaybetmişse, isteğe göre yeni link atılır.

---

## 🔑 Kimlik Doğrulama & CSRF

- **Login (`POST /auth/login`)**
    - Onaylı kullanıcılar için JWT oluşturulur ve `HttpOnly`, `SameSite=Strict` cookie’de saklanır.

- **CSRF Koruması**
    - `GET /csrf-token` endpoint’i, hem çerez hem JSON olarak token döner.
    - Frontend `api.js` içindeki `getCsrfToken()` fonksiyonu, state-changing isteklerden önce otomatik CSRF token ekler.

- **Logout (`POST /auth/logout`)**
    - Cookie temizlenir.

---

## 📌 Kullanım Notları

- Backend ve frontend ayrı terminallerde çalıştırılır.
- Local geliştirmede `http://localhost:4000` (API) ve `http://localhost:5173` (UI) kullanılır.
- Üretimde `CORS_ORIGINS` ve `VITE_API_BASE` değerlerinizi canlı domain’lere göre güncelleyin.
- Yeni özellikler ve iyileştirmeler eklemeye devam edilecektir.

---

## 📁 Proje Yapısı

```
project-management-app/
├── client/                       # Frontend (React + Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── api.js                # Tüm API çağrıları; fetchApi, getCsrfToken, auth, boards, columns, cards, comments…
│   │   ├── components/           # UI bileşenleri (shadcn/ui wrapper’leri)
│   │   ├── pages/                # Sayfa bileşenleri
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── BoardDetail.jsx
│   │   │   └── CardDetail.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Tailwind ayarları
│   ├── .env                      # VITE_API_BASE
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── server/                       # Backend (Express.js + Drizzle ORM)
│   ├── db/
│   │   ├── index.js              # Drizzle + PostgreSQL bağlantısı
│   │   └── schema.js             # users, boards, columns, cards, comments tabloları
│   ├── controllers/              # İş mantığı (register, login, verifyEmail, resendVerification, boards, columns, cards, comments)
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   ├── columnController.js
│   │   ├── cardController.js
│   │   └── commentController.js
│   ├── middleware/               # Ara katmanlar
│   │   ├── auth.js               # JWT doğrulama
│   │   ├── csrfErrorHandler.js   # CSRF hatalarını işleme
│   │   └── errorHandler.js       # Genel hata işleyici
│   ├── routes/                   # HTTP route tanımları
│   │   ├── auth.js               # /auth/register, /auth/verify-email, /auth/resend-verification, /auth/login, /auth/me, /auth/logout
│   │   ├── boards.js             # /boards, /boards/:id/invite, /boards/:id/members
│   │   ├── columns.js            # /boards/:boardId/columns
│   │   ├── cards.js              # /boards/:boardId/columns/:columnId/cards
│   │   └── comments.js           # /cards/:cardId/comments
│   ├── utils/
│   │   └── mailer.js             # Nodemailer transporter ve sendMail
│   ├── .env                      # DATABASE_URL, JWT_SECRET, SMTP_*, CORS_ORIGINS
│   ├── server.js                 # Express setup: cors, csurf, express.json, cookie-parser, route’lar
│   └── package.json
│
├── README.md                     
└── .gitignore                    
```