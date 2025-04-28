
# Project Management App

Bu proje Trello ve Notion benzeri bir görev yönetim uygulamasıdır. Kullanıcılar kendi panolarını (board), listelerini (column) ve kartlarını (card) oluşturabilir, kartları kolonlar arasında veya kolon içinde sürükleyerek taşıyabilir ve sıralamasını değiştirebilir.

Frontend tarafında React 19, Vite, Tailwind CSS 4, shadcn/ui bileşenleri ve dnd-kit kullanılmıştır. Backend tarafında Node.js, Express.js, PostgreSQL ve Drizzle ORM ile JWT kimlik doğrulama mekanizması kurulmuştur.

Proje iki ana klasörden oluşur:
- **client/**: React ile yazılmış frontend uygulaması
- **server/**: Node.js ve Express ile yazılmış API sunucusu

Projeyi çalıştırmak için önce repoyu klonlayın:

```bash
git clone https://github.com/kullanici-adi/project-management-app.git
cd project-management-app
```

### Backend (server/) kurulumu için:

```bash
cd server
npm install
```

Sonrasında `.env` dosyası oluşturun ve içine aşağıdaki bilgileri yazın:

```env
DATABASE_URL=postgresql://kullanici_adi:sifre@localhost:5432/veritabani_adi
JWT_SECRET=senin_secret_keyin
```

Daha sonra backend sunucusunu başlatın:

```bash
npm run dev
```

Sunucu çalışmaya başlayacak ve `http://localhost:4000` adresinde API servisi verecektir.

### Frontend (client/) kurulumu için:

```bash
cd ../client
npm install
```

Ardından yine `client` dizini içinde `.env` dosyası oluşturup içine aşağıdaki bilgileri yazın:

```env
VITE_API_BASE=http://localhost:4000/api
```

Frontend uygulamasını başlatmak için:

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılacaktır.

---

### Özellikler

- Kullanıcı kayıt ve giriş işlemleri (JWT token ile)
- Kişisel panolar oluşturma
- Panolara kolonlar ekleyebilme
- Kolonlara kartlar ekleyebilme
- Kartları aynı kolon içinde sıralayabilme
- Kartları kolonlar arasında taşıyabilme
- Kart sıralamalarının veritabanında güncellenmesi
- Kart ve kolon silme işlemleri
- Responsive, mobil uyumlu ve modern UI
- Framer Motion ve dnd-kit ile akıcı sürükleme animasyonları

---

### Proje Yapısı

```
project-management-app/
├── client/   # React + Vite + Tailwind + shadcn
├── server/   # Express.js + Drizzle ORM + PostgreSQL
├── README.md
├── .gitignore
```

`.gitignore` dosyası sayesinde aşağıdaki dosya ve klasörler repoya yüklenmeyecektir:
- `node_modules/`
- `.env`
- `dist/`
- `build/`

---

### Notlar

- Hem frontend hem backend klasörlerinde `npm install` komutu çalıştırılmalıdır.
- Sunucu (server) ve istemci (client) ayrı ayrı başlatılır.
- Server tarafında kimlik doğrulama JWT ile yapılır ve her API isteğinde token header ile gönderilmelidir.
- Kullanıcı giriş yaptıktan sonra token `localStorage` içine kaydedilir ve her istek otomatik olarak bu token ile yapılır.
- Kart sıralamaları hem frontend state üzerinde hem de backend veritabanı üzerinde canlı olarak güncellenir.
- Eğer boş bir kolona kart taşımak istenirse veya yeni oluşturulan boş kolonlar varsa sürükleme sorunsuz şekilde yapılabilir.
- Sıralama değişiklikleri kolonlar arası taşımalar veya kolon içi kart kaydırmalarında ayrı ayrı API çağrılarıyla kaydedilir.

---

### Yüklemek için:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/kullanici-adi/project-management-app.git
git push -u origin main
```

---

### İyi çalışmalar!
