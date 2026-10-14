# 🔧 راهنمای رفع مشکلات PWA

## ✅ مشکلات حل شده

### مشکل ۱: 404 در Safari بعد از Add to Home Screen

**علت:** مسیرهای absolute (`/manifest.json`) روی ساب‌دامین کار نمی‌کردن.

**راه‌حل:** 
- ✅ `base: './'` در vite.config.js اضافه شد
- ✅ همه مسیرها relative شدن (`./manifest.json`)
- ✅ Service Worker scope داینامیک شد
- ✅ 404.html بهبود پیدا کرد

### مشکل ۲: دکمه Install App کار نمیکنه

**علت:** 
- Safari از `beforeinstallprompt` پشتیبانی نمیکنه
- فقط Chrome/Edge این قابلیت رو دارن

**راه‌حل:**
- ✅ تشخیص خودکار مرورگر
- ✅ برای Chrome/Edge: دکمه نصب نیتیو
- ✅ برای Safari/iOS: راهنمای نصب دستی با modal
- ✅ پیام مناسب برای هر مرورگر

---

## 📱 نحوه نصب روی هر دستگاه

### 🍎 iPhone/iPad (iOS)

**نکته مهم:** فقط با **Safari** کار میکنه، نه Chrome!

1. بازی رو در **Safari** باز کنید
2. روی دکمه **Share** (⬆️) در پایین صفحه بزنید
3. به پایین اسکرول کنید و **"Add to Home Screen"** رو بزنید
4. نام بازی رو تایید کنید و **"Add"** رو بزنید
5. آیکون بازی روی صفحه اصلی ظاهر میشه ✅

**اگه 404 میده:**
- مطمئن بشید URL درست باشه (بدون `/index.html` در آخر)
- کش Safari رو پاک کنید: Settings → Safari → Clear History
- دوباره امتحان کنید

### 🤖 Android (Chrome)

**روش ۱ - دکمه Install:**
1. بازی رو باز کنید
2. روی دکمه **"📲 Install App"** بزنید
3. **"Install"** رو بزنید

**روش ۲ - منوی Chrome:**
1. روی منوی سه نقطه (⋮) بزنید
2. **"Install app"** یا **"Add to Home screen"** رو انتخاب کنید
3. تایید کنید

### 💻 Desktop (Chrome/Edge)

1. بازی رو باز کنید
2. روی آیکون نصب در نوار آدرس بزنید
3. یا از منوی مرورگر **"Install Turbo Rush"** رو انتخاب کنید

### 🍎 Mac (Safari)

1. بازی رو در **Safari** باز کنید
2. روی **Share** button در toolbar بزنید
3. **"Add to Dock"** رو انتخاب کنید
4. تایید کنید

---

## 🔍 تست PWA

### Chrome DevTools

1. **F12** رو بزنید
2. به تب **Application** برید
3. چک کنید:
   - **Manifest**: باید بدون خطا باشه
   - **Service Workers**: باید registered باشه
   - **Cache Storage**: باید فایل‌ها کش شده باشن

### Lighthouse Audit

1. **F12** → تب **Lighthouse**
2. تیک **Progressive Web App** رو بزنید
3. **Generate report** رو بزنید
4. باید امتیاز 100 بگیرید ✅

### تست آفلاین

1. DevTools → تب **Application** → **Service Workers**
2. تیک **Offline** رو بزنید
3. صفحه رو رفرش کنید
4. باید بازی لود بشه ✅

---

## ⚠️ مشکلات رایج

### ۱. آیکون نمایش داده نمیشه

**علت:** مرورگر آیکون رو کش نکرده

**راه‌حل:**
- کش مرورگر رو پاک کنید
- یه بار دیگه Add to Home Screen بزنید
- از فرمت PNG به جای SVG استفاده کنید (برای iOS)

### ۲. بازی تمام صفحه نمیشه

**علت:** `display` در manifest اشتباهه

**راه‌حل:**
- باید `"display": "standalone"` باشه
- `apple-mobile-web-app-capable` باید `yes` باشه

### ۳. Service Worker ثبت نمیشه

**علت:** HTTPS نیست یا scope اشتباهه

**راه‌حل:**
- مطمئن بشید روی HTTPS اجرا میشه
- GitHub Pages خودکار HTTPS داره
- Console رو چک کنید برای خطاها

### ۴. بعد از آپدیت، نسخه قدیمی لود میشه

**علت:** Service Worker کش قدیمی رو استفاده میکنه

**راه‌حل:**
- منتظر بمونید تا SW آپدیت بشه (30 دقیقه)
- یا دستی رفرش کنید
- یا کش رو پاک کنید

---

## 🎯 چک‌لیست PWA

- [x] `manifest.json` با مسیرهای relative
- [x] Service Worker با scope داینامیک
- [x] آیکون SVG (scalable)
- [x] Meta tags برای iOS
- [x] Splash screen
- [x] Safe area support
- [x] Offline support
- [x] HTTPS (GitHub Pages)
- [x] دکمه نصب با تشخیص مرورگر
- [x] راهنمای نصب برای Safari

---

## 📊 ساختار فایل‌ها

```
public/
├── manifest.json          ✅ تنظیمات PWA
├── sw.js                  ✅ Service Worker
├── icon.svg               ✅ آیکون اصلی
├── icon-maskable.svg      ✅ آیکون maskable
├── splash.svg             ✅ صفحه splash
├── 404.html               ✅ هندل کردن SPA routing
└── robots.txt             ✅ SEO

src/
├── pwa.ts                 ✅ ماژول PWA
├── main.tsx               ✅ ثبت Service Worker
└── components/
    └── MainMenu.tsx       ✅ دکمه نصب + راهنما
```

---

## 🚀 Deploy روی GitHub Pages

1. فایل‌ها رو push کنید
2. Settings → Pages → GitHub Actions
3. منتظر بمونید تا deploy بشه
4. بازی روی `https://username.github.io/repo-name/` در دسترسه

**نکته:** با `base: './'` همه چیز relative هست و روی هر ساب‌پوشه‌ای کار میکنه ✅

---

## 💡 نکات مهم

### Safari محدودیت‌ها:
- ❌ از `beforeinstallprompt` پشتیبانی نمیکنه
- ❌ Push Notification محدود
- ✅ از meta tags استفاده میکنه
- ✅ Add to Home Screen کار میکنه

### iOS نکات:
- فقط با Safari کار میکنه (نه Chrome)
- محدودیت حافظه کش
- Splash screen ثابت

### Android نکات:
- Chrome بهترین پشتیبانی رو داره
- از manifest.json استفاده میکنه
- Push Notification کامل

---

## 🎮 خلاصه

✅ **مشکل 404 حل شد** - مسیرها relative شدن
✅ **دکمه Install کار میکنه** - تشخیص مرورگر + راهنمای دستی
✅ **Safari پشتیبانی میشه** - با meta tags و راهنمای نصب
✅ **آفلاین کار میکنه** - Service Worker + Cache
✅ **تمام صفحه** - standalone display mode

**بازی آماده نصب و بازی روی همه دستگاه‌هاست! 🏁**
