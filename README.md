# Lotte

Nuxt ile geliştirilmiş, kendi sunucunda çalıştırabileceğin hafif bir dijital kartvizit uygulaması.

Lotte basit bir fikir üzerine kuruldu:

> Küçük değişiklikler için koca koca yönetim panellerine ne gerek var?

Bu yüzden hesap sistemi, oturum (session), JWT veya OAuth yerine 6 haneli bir ana PIN ile çalışan imza (signature) tabanlı bir doğrulama mekanizması kullanır.

## ✨ Özellikler

- Minimal ve mobil odaklı arayüz
- Kendi sunucunda çalıştırabilme
- Serverless uyumlu yapı
- Bağlantı yönetimi
- İmza tabanlı içerik doğrulama
- Vercel, Netlify ve Cloudflare üzerinde çalıştırılabilir

## ✅ Ne Yapar / ❌ Ne Yapmaz

### Yapar

- Dijital kartvizit bilgilerini görüntüler.
- Profil ve bağlantıları güncelleyebilir.
- İçerik değişikliklerini 6 haneli PIN ile doğrular.
- Kullanıcı hesabı oluşturmadan sahiplik kontrolü sağlar.
- Tek kullanıcı odaklı, basit bir yönetim deneyimi sunar.

### Yapmaz

- Çok kullanıcılı bir sistem değildir.
- Kayıt olma veya giriş yapma ekranı içermez.
- Session, JWT veya OAuth kullanmaz.
- Rol ve yetki yönetimi sunmaz.
- Yönetim paneli veya kapsamlı bir CMS olmayı hedeflemez.

## 🔐 Güvenlik Modeli

Lotte geleneksel bir kimlik doğrulama sistemi kullanmaz.

Her kurulumda kaynakları doğrulamak amacıyla **6 haneli bir Master PIN** kullanılır.

Veritabanında saklanan her kayıt, HMAC-SHA256 algoritması ile imzalanır.

- **Anahtar (Key):** Master PIN
- **Mesaj (Message):** Kaynağın içeriği

Bir kayıt güncellenirken veya silinirken:

1. İstemci mevcut PIN'i gönderir.
2. Sunucu kayıt üzerindeki imzayı doğrular.
3. Doğrulama başarılıysa işlem gerçekleştirilir.
4. Güncellenen içerik için yeni bir imza oluşturulur.

Bu sayede herhangi bir oturum veya kullanıcı bilgisi saklanmadan içerik sahipliği doğrulanabilir.

## ⚠ Özel Durumlar

### Boş Veritabanı

İlk kurulumda doğrulanabilecek herhangi bir kayıt bulunmadığından, `NUXT_DEFAULT_SIGNATURE_PIN` değişkeni başlangıç PIN'i olarak kullanılır.

İlk kayıt oluşturulduktan sonra bu PIN artık kullanılmaz.

### Son Kaydın Silinmesi

İmza zincirinin korunabilmesi için sistem veritabanında her zaman görünmeyen dahili bir kayıt tutar.

Bu kayıt API üzerinden erişilebilir değildir ve yeni bir kayıt oluşturulana dek imza zincirini korumak için devam eder.

## 🚀 Kurulum

Projeyi klonlayın:

```bash
git clone https://github.com/squezilia/lotte.git

cd lotte
```

Bağımlılıkları yükleyin:

```bash
bun install
```

`.env` dosyasını oluşturun:

```env
DATABASE_URL="postgresql://..."
NUXT_DEFAULT_SIGNATURE_PIN="123456"
```

Veritabanı migration'larını çalıştırın:

```bash
bun prisma migrate deploy
```

Geliştirme sunucusunu başlatın:

```bash
bun dev
```

## 📦 Ortam Değişkenleri

| Değişken                     | Zorunlu | Açıklama                                         |
| ---------------------------- | ------- | ------------------------------------------------ |
| `DATABASE_URL`               | Evet    | PostgreSQL bağlantı adresi                       |
| `NUXT_DEFAULT_SIGNATURE_PIN` | Evet    | İlk kurulum sırasında kullanılan başlangıç PIN'i |

## 📄 Lisans

AGPLv3
