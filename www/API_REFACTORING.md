# 7de Yedi Vale - Frontend Refactoring

Bu proje, 7de Yedi Vale kurye hizmeti uygulamasının frontend kısmının yeni backend API'si ile entegre edilmesi için yapılan büyük refactoring çalışmasını içerir.

## 🔄 Yapılan Değişiklikler

### API Entegrasyonu

- ✅ Eski PHP API istekleri kaldırıldı
- ✅ Yeni NestJS backend ile entegrasyon
- ✅ Merkezi API client yapısı (Axios)
- ✅ SWR ile data fetching ve caching
- ✅ TypeScript tip güvenliği

### Yeni API Servisleri

- `authService` - Kimlik doğrulama
- `callCourierService` - Kurye çağırma işlemleri
- `courierApplicationService` - Kurye başvuruları
- `courierServiceService` - Kurye hizmetleri

### React Hooks

- `useAuth` - Kimlik doğrulama hook'ları
- `useCallCourier` - Kurye çağırma hook'ları
- `useCourierApplication` - Başvuru hook'ları
- `useCourierService` - Hizmet hook'ları

### Sayfalar

- ✅ `/admin/login` - Yeni auth sistemi
- ✅ `/admin` - SWR ile data fetching
- ✅ `/kurye-cagir` - Yeni API entegrasyonu
- ✅ `/kurye-basvuru` - Yeni API entegrasyonu

## 🚀 Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **SWR** - Data fetching ve caching
- **Axios** - HTTP client
- **React Hook Form** - Form yönetimi
- **Tailwind CSS** - Styling
- **React Hot Toast** - Bildirimler

## 📁 Klasör Yapısı

```
www/
├── src/
│   ├── lib/
│   │   ├── api/           # API servisleri
│   │   │   ├── auth.service.ts
│   │   │   ├── call-courier.service.ts
│   │   │   ├── courier-application.service.ts
│   │   │   └── index.ts
│   │   └── auth.ts        # Auth helper fonksiyonları
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCallCourier.ts
│   │   ├── useCourierApplication.ts
│   │   └── useCourierService.ts
│   ├── utils/
│   │   └── axiosInstance.ts  # Merkezi HTTP client
│   ├── types/
│   │   └── index.ts       # TypeScript tipleri
│   └── components/
│       └── providers/
│           └── swr-provider.tsx
```

## 🔧 Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=10000

# Auth Configuration
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key

# App Configuration
NEXT_PUBLIC_APP_NAME=7de Yedi Vale
NEXT_PUBLIC_APP_VERSION=2.0.0
```

## 🛠️ Kurulum

1. Dependencies'i yükleyin:

```bash
npm install
```

2. Environment variables'ı ayarlayın:

```bash
cp .env.example .env.local
```

3. Development server'ı başlatın:

```bash
npm run dev
```

## 🔄 API Endpoints

### Auth

- `POST /auth/login` - Giriş
- `POST /auth/register` - Kayıt

### Call Courier

- `GET /call-courier` - Tüm çağrıları listele
- `POST /call-courier` - Yeni çağrı oluştur
- `GET /call-courier/:id` - Çağrı detayı
- `PATCH /call-courier/:id` - Çağrı güncelle
- `DELETE /call-courier/:id` - Çağrı sil

### Courier Application

- `GET /courier-application` - Tüm başvuruları listele
- `POST /courier-application` - Yeni başvuru oluştur
- `GET /courier-application/:id` - Başvuru detayı
- `PATCH /courier-application/:id` - Başvuru güncelle
- `DELETE /courier-application/:id` - Başvuru sil

### Courier Service

- `GET /courier-service` - Tüm hizmetleri listele
- `POST /courier-service` - Yeni hizmet oluştur
- `GET /courier-service/:id` - Hizmet detayı
- `PATCH /courier-service/:id` - Hizmet güncelle
- `DELETE /courier-service/:id` - Hizmet sil

## 🎯 Özellikler

### Hata Yönetimi

- Global error handling with Axios interceptors
- Toast notifications for user feedback
- Automatic token refresh
- Network error detection

### Loading States

- SWR ile otomatik loading states
- Skeleton loading components
- Optimistic updates

### Caching

- SWR ile otomatik caching
- Background data fetching
- Stale-while-revalidate pattern

### Type Safety

- Full TypeScript coverage
- API response types
- Form validation types

## 🔍 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check
```

## 📝 TODO

- [ ] User roles ve permissions
- [ ] Real-time notifications
- [ ] Offline support
- [ ] Performance optimization
- [ ] Error boundary components
- [ ] Logging ve monitoring
- [ ] API rate limiting
- [ ] Image upload functionality

## 🤝 Contributing

1. Feature branch oluşturun
2. Değişikliklerinizi commit edin
3. Pull request açın

## 📄 License

Bu proje MIT lisansı altında lisanslanmıştır.
