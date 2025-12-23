# Prisma Migration Best Practices

## Kalıcı Çözüm: Otomatik Prisma Client Generation ✅

### Ne Yaptık?

`package.json`'a iki script ekledik:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

### Bu Ne İşe Yarar?

#### 1. `postinstall` Script
- **Ne zaman çalışır**: Her `npm install` sonrası
- **Ne yapar**: Prisma client'ı otomatik generate eder
- **Nerede kullanılır**: 
  - Local development (yeni dependency eklendiğinde)
  - Vercel deployment (production build sırasında)
  - CI/CD pipeline'ları

#### 2. `build` Script Güncelleme
- **Ne zaman çalışır**: Production build sırasında
- **Ne yapar**: Önce Prisma client generate eder, sonra Next.js build yapar
- **Neden önemli**: Deployment sırasında Prisma client'ın güncel olmasını garanti eder

### Artık Ne Değişti?

**Önceki Durum (Sorunlu):**
```bash
# Migration yaptın
npx prisma migrate dev

# Ama Prisma client güncel değil!
# Manuel generate gerekiyordu:
npx prisma generate

# Server restart gerekiyordu
npm run dev
```

**Yeni Durum (Otomatik):**
```bash
# Migration yaptın
npx prisma migrate dev

# Prisma client otomatik güncellendi! ✅
# (postinstall script çalıştı)

# Sadece server restart yeterli
npm run dev
```

### Deployment Senaryoları

#### Vercel (Production)
1. Git push yaparsın
2. Vercel `npm install` çalıştırır
3. `postinstall` otomatik Prisma generate yapar ✅
4. `npm run build` çalışır
5. Her şey güncel! 🚀

#### Local Development
1. Yeni migration oluşturursun
2. `npm install` çalıştırırsın (veya dependencies güncellersin)
3. Prisma client otomatik güncellenir ✅
4. Hata almadan çalışır!

### Migration Workflow (Güncellenmiş)

**Yeni migration oluştururken:**
```bash
# 1. Migration oluştur
npx prisma migrate dev --name my_new_migration

# 2. Prisma client otomatik güncellendi! (postinstall sayesinde)

# 3. Server restart et (değişiklikleri yüklemek için)
# Ctrl+C ile durdur, sonra:
npm run dev
```

**Production'a deploy ederken:**
```bash
# 1. Commit ve push
git add .
git commit -m "feat: add new migration"
git push

# 2. Vercel otomatik deploy eder
# 3. postinstall otomatik çalışır ✅
# 4. build script Prisma generate yapar ✅
# 5. Her şey hazır!
```

### Ek Güvenlik: Pre-commit Hook (Opsiyonel)

Daha da garantiye almak için `.husky` ile pre-commit hook eklenebilir:

```bash
# Husky kur
npm install --save-dev husky
npx husky install

# Pre-commit hook ekle
npx husky add .husky/pre-commit "npx prisma generate"
```

Bu sayede her commit öncesi Prisma client güncel olur.

### Özet

✅ **postinstall**: Her install sonrası otomatik generate  
✅ **build**: Production build öncesi otomatik generate  
✅ **Vercel**: Deployment sırasında otomatik çalışır  
✅ **Local**: Development sırasında otomatik güncellenir  

**Artık manuel `prisma generate` çalıştırmana gerek yok!** 🎉

### Hata Durumunda

Eğer yine de sorun yaşarsan:

```bash
# Cache temizle ve yeniden kur
rm -rf node_modules .next
npm install
npm run dev
```

Bu her şeyi sıfırdan kurar ve Prisma client'ı günceller.
