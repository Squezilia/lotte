# Basit QR Kartvizit

Stateless, auth ve admin yönetimi gerektirmeyen basit bir kartvizit sitesi.

## Ne Yapar, Ne Yapmaz

Bu proje şunları yapar;

- Linklerinizi, hızlıca paylaşmak istediğiniz bilgilerinizi kolayca barındırmanızı sağlar.
- CMS, Veritabanı gibi şeylerle uğraşmamanızı sağlar.
- Postgres dışında bir bağımlılığı olmadığından hızlıca ve kolayca host etmenizi sağlar.
- Stateless olduğundan neredeyse bir Raspberry Pi Zero'da host edilebilir.

Bu proje şunları yapmaz;

- Multi-tenant bir Link uygulaması sunmaz.
- URL Shortener değildir.
- 255'den fazla linki barındıramaz.
- Dosya veya resim servis edemez.

## Proje

### Gereksinimler

- PostgreSQL Sunucusu. (Local bir sunucu, Neon PostgreSQL veya Supabase PostgreSQL kullanabilirsiniz.)
- Bun Runtime

### Kurulum

1. `.env.example` dosyasını `.env` olacak şekilde yeniden adlandırın ve içerisindeki değerleri uygun bir şekilde ayarlayın.
2. `bun install` komutuyla bağımlılıkları indirin.

### Package Reference

```bash
bun run start # Projeyi önizleme olarak başlatır.
bun run dev # Projeyi geliştirme modunda başlatır.
bun run build # Projeyi derler.
bun run database:generate # Veritabanı clientini derler.
bun run database:push # Veritabanı şemasını uygular.
bun run database:pull # Veritabanı şemasını çeker.
bun run lint # Linterı çalıştırır.
```

## Teknik Açıklama

Bu projenin teknik açıklamasını yapmadan önce şu soruyu cevaplandırmamız gerek; "Neden mimariyi böyle bir şey yaptım?". Neden, çünkü;

- Auth, session handling ve CMS sistemleriyle uğraşmak istemedim.
- Projenin yapısını büyütmek istemedim.
- İhtiyacım kadar olan teknik borç çıkartmaya çalıştım.

Sorunun cevabını verdiysek devam edelim. Bu projeni en temeldeki kaynağı "Link" içinde güvenlik amacıyla kendi kendini doğrulayan bir signature (imza) barındırır. Bu imza kullanıcının belirlediği bir PIN ile SHA256-HMAC kullanarak oluşturulur.

İmzalama bir zincir halinde gerçekleşir. Başta hiçbir şeyi olmayan sistem varsayılan bir PIN ile gelir, bu PIN sayesinde ilk kaynağını elde ettikten sonra oluşturulucak yeni kaynaklar ancak kullanıcının önceki kaynaklardan birinin imzasını doğrulamasıyla oluşturulabilir.

Bu sistemin mevcut PIN'i unutmaması için en az 1 geçerli imza bulundurması gerekir, bu yüzden son kaynak silinse dahi sistem bunu kullanıcıya göstermez.

Bu mimari tercihin iyi yanları;

- Hafif olması, doğrulama ve kaynak oluşturmak için çok az adım gerektirmesi.
- Kolay bir şekilde güvenli olması.
- Stateless olması.

Bu mimari tercihin kötü yanları;

- Her kaynağın kendi kendini doğrulaması sebebiyle veritabanından doğrudan bir düzenleme yapamazsınız. Kaynağın verilerinden birisinin değişmesi halinde imza doğrulanamaz ve bu sebepten dolayı kaynak ile ilgili işlemler sonsuza kadar kitlenir.
- Sistemde bir PIN değişikliğine gidileceği zaman her kaynağın kendi imzasının yeniden oluşturulması gerekir.
