# Yedi API NestJS

## Açıklama

Bu proje, NestJS framework kullanılarak geliştirilmiş bir API projesidir.

## Kurulum

```bash
# Bağımlılıkları yükleyin
$ npm install
```

## Çalıştırma

```bash
# Geliştirme modu
$ npm run start:dev

# Üretim modu
$ npm run start:prod
```

## API Dökümantasyonu

Uygulama çalıştıktan sonra Swagger API dökümantasyonuna erişmek için tarayıcınızdan aşağıdaki URL'yi ziyaret edebilirsiniz:

```
http://localhost:3000/api/docs
```

## Veritabanı

Bu proje PostgreSQL veritabanı kullanmaktadır. Veritabanı bağlantı ayarlarını `.env` dosyasında yapılandırabilirsiniz.

## Test

```bash
# Unit testleri
$ npm run test

# E2E testleri
$ npm run test:e2e

# Test kapsamı
$ npm run test:cov
```
