# Premium Kullanıcı Yönetimi

## Yöntem 1: Admin API Endpoint (Önerilen) 🚀

Admin API endpoint'i oluşturuldu: `/api/admin/subscription`

### Kurulum

1. `.env` dosyasına admin key ekle:
```bash
ADMIN_SECRET_KEY=your-super-secret-admin-key-here
```

2. Production'da mutlaka güçlü bir key kullan!

### Kullanım

#### cURL ile (Terminal)

**Premium'a yükselt:**
```bash
curl -X POST http://localhost:3000/api/admin/subscription \
  -H "Authorization: Bearer your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-supabase-id","action":"upgrade"}'
```

**Free'ye düşür:**
```bash
curl -X POST http://localhost:3000/api/admin/subscription \
  -H "Authorization: Bearer your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-supabase-id","action":"downgrade"}'
```

**Subscription kontrol et:**
```bash
curl -X GET "http://localhost:3000/api/admin/subscription?userId=user-supabase-id" \
  -H "Authorization: Bearer your-admin-key"
```

#### Bash Script ile (En Kolay) ✨

Script oluşturuldu: `scripts/manage-premium.sh`

**Kullanım:**
```bash
# Premium'a yükselt
./scripts/manage-premium.sh upgrade user@example.com

# Free'ye düşür
./scripts/manage-premium.sh downgrade user@example.com

# Kontrol et
./scripts/manage-premium.sh check user@example.com
```

**İlk kullanımda:**
1. Script'i düzenle: `ADMIN_KEY` ve `API_URL` değerlerini güncelle
2. Supabase Dashboard > Authentication > Users'dan user ID'yi kopyala
3. Script çalıştır

---

## Yöntem 2: Supabase SQL Editor (Hızlı) ⚡

Supabase Dashboard > SQL Editor'da:

**Premium'a yükselt:**
```sql
UPDATE "UserSubscription" 
SET tier='premium', aiEnabled=true, maxNotes=NULL 
WHERE userId='user-supabase-id';
```

**Free'ye düşür:**
```sql
UPDATE "UserSubscription" 
SET tier='free', aiEnabled=false, maxNotes=25 
WHERE userId='user-supabase-id';
```

**Kontrol et:**
```sql
SELECT * FROM "UserSubscription" WHERE userId='user-supabase-id';
```

---

## Yöntem 3: Supabase Table Editor (En Basit) 🖱️

1. Supabase Dashboard > Table Editor > UserSubscription
2. Kullanıcıyı bul (userId ile ara)
3. Satıra tıkla ve düzenle:
   - **Premium için**: `tier='premium'`, `aiEnabled=true`, `maxNotes=null`
   - **Free için**: `tier='free'`, `aiEnabled=false`, `maxNotes=25`
4. Save

---

## User ID Nasıl Bulunur? 🔍

### Supabase Dashboard
1. Authentication > Users
2. Kullanıcı email'ini ara
3. User ID'yi kopyala (UUID formatında)

### SQL ile
```sql
SELECT id, email FROM auth.users WHERE email='user@example.com';
```

---

## Toplu İşlemler (Bulk Operations)

**Birden fazla kullanıcıyı premium yap:**
```sql
UPDATE "UserSubscription" 
SET tier='premium', aiEnabled=true, maxNotes=NULL 
WHERE userId IN (
  'user-id-1',
  'user-id-2',
  'user-id-3'
);
```

**Email listesinden premium yap:**
```sql
UPDATE "UserSubscription" 
SET tier='premium', aiEnabled=true, maxNotes=NULL 
WHERE userId IN (
  SELECT id FROM auth.users 
  WHERE email IN (
    'user1@example.com',
    'user2@example.com',
    'user3@example.com'
  )
);
```

---

## Güvenlik Notları 🔒

1. **ADMIN_SECRET_KEY**: Production'da güçlü, rastgele bir key kullan
2. **API Endpoint**: Sadece güvenilir IP'lerden erişime izin ver (opsiyonel)
3. **Rate Limiting**: Admin endpoint'e rate limit eklenebilir
4. **Logging**: Tüm admin işlemleri loglanıyor

---

## Önerilen Workflow 📋

**Yeni premium kullanıcı için:**
1. Kullanıcıdan email al
2. Supabase Dashboard'dan user ID bul
3. Bash script çalıştır: `./scripts/manage-premium.sh upgrade user@example.com`
4. Kullanıcıya bilgi ver

**Hızlı kontrol için:**
- Supabase Table Editor'ı kullan (görsel, kolay)

**Toplu işlemler için:**
- SQL Editor'da bulk update query'leri çalıştır

---

## Test Etme

Local'de test et:
```bash
# Admin key'i .env'e ekle
echo "ADMIN_SECRET_KEY=test-admin-key-123" >> .env

# Server'ı restart et
npm run dev

# Script'i test et
./scripts/manage-premium.sh upgrade test@example.com
```

Production'da:
- `API_URL` değişkenini production URL'e çevir
- Güçlü admin key kullan
- HTTPS üzerinden çalıştır
