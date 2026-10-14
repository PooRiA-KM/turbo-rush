# 📱 راهنمای PWA - Turbo Rush

## ✅ بازی الان یه PWA کامله!

بازی **Turbo Rush** الان تمام ویژگی‌های یک Progressive Web App رو داره و می‌تونه مثل یه اپلیکیشن نیتیو روی موبایل اجرا بشه.

---

## 🎯 ویژگی‌های PWA

| ویژگی | وضعیت | توضیح |
|--------|--------|--------|
| 📲 قابل نصب | ✅ | کاربر می‌تونه بازی رو روی گوشی نصب کنه |
| 🌐 کار آفلاین | ✅ | بعد از اولین لود، بدون اینترنت هم کار می‌کنه |
| 📱 تمام صفحه | ✅ | بدون نوار مرورگر، مثل اپ نیتیو |
| 🔔 نوتیفیکیشن | ✅ | پشتیبانی از push notification |
| 🎨 آیکون اختصاصی | ✅ | آیکون SVG با کیفیت بالا |
| ⚡ سریع | ✅ | Service Worker فایل‌ها رو کش می‌کنه |
| 🔄 آپدیت خودکار | ✅ | نسخه جدید خودکار دانلود میشه |
| 🔒 HTTPS | ✅ | روی GitHub Pages با HTTPS اجرا میشه |

---

## 📲 نحوه نصب روی موبایل

### Android (Chrome):
1. بازی رو در Chrome باز کنید
2. روی منوی سه نقطه (⋮) بزنید
3. گزینه **"Install app"** یا **"افزودن به صفحه اصلی"** رو انتخاب کنید
4. یا روی دکمه "📲 Install App" در صفحه اصلی بازی بزنید

### iOS (Safari):
1. بازی رو در Safari باز کنید
2. روی دکمه Share (مربع با فلش) بزنید
3. گزینه **"Add to Home Screen"** رو انتخاب کنید
4. نام بازی رو تایید کنید و **Add** رو بزنید

### Desktop (Chrome/Edge):
1. بازی رو باز کنید
2. روی آیکون نصب در نوار آدرس بزنید
3. یا از منوی مرورگر **Install Turbo Rush** رو انتخاب کنید

---

## 🏗️ ساختار فایل‌های PWA

```
public/
├── manifest.json          # تنظیمات PWA
├── sw.js                  # Service Worker
├── icon.svg               # آیکون اصلی
├── icon-maskable.svg      # آیکون maskable (برای اندروید)
├── splash.svg             # صفحه splash
└── 404.html               # هندل کردن SPA routing
```

---

## 🔧 تنظیمات manifest.json

```json
{
  "name": "Turbo Rush - Motor Racing",
  "short_name": "Turbo Rush",
  "display": "fullscreen",        // تمام صفحه
  "orientation": "portrait",      // عمودی
  "background_color": "#111827",  // رنگ پس‌زمینه
  "theme_color": "#111827"        // رنگ نوار وضعیت
}
```

---

## 🌐 Service Worker

فایل `sw.js` وظایف زیر رو انجام میده:

1. **Precaching**: فایل‌های اصلی رو هنگام نصب کش می‌کنه
2. **Cache-first strategy**: اول از کش می‌خونه، اگه نبود از شبکه
3. **Background updates**: فایل‌های جدید رو در پس‌زمینه آپدیت می‌کنه
4. **Offline support**: وقتی آفلاین هستید، نسخه کش شده رو نشون میده
5. **Update notifications**: وقتی نسخه جدید آماده‌ست، اطلاع میده

---

## 📱 ویژگی‌های موبایل

### Safe Area Support
بازی از `env(safe-area-inset-*)` استفاده می‌کنه تا با notch و home indicator سازگار باشه.

### Landscape Warning
اگه گوشی رو افقی بگیرید، یه پیام نمایش داده میشه که گوشی رو عمودی کنید.

### Touch Controls
دکمه‌های لمسی بزرگ و راحت برای کنترل بازی.

### No Scroll/Bounce
جلوگیری از pull-to-refresh و bounce effect.

---

## 🚀 تست PWA

### در Chrome DevTools:
1. F12 رو بزنید
2. به تب **Application** برید
3. بخش **Manifest** رو چک کنید
4. بخش **Service Workers** رو چک کنید
5. تیک **Offline** رو بزنید و تست کنید

### Lighthouse Audit:
1. F12 → تب **Lighthouse**
2. تیک **Progressive Web App** رو بزنید
3. **Generate report** رو بزنید
4. امتیاز PWA رو ببینید

---

## 🔔 نوتیفیکیشن‌ها

بازی از Push Notification پشتیبانی می‌کنه. برای فعال‌سازی:

```javascript
import { requestNotificationPermission } from './pwa';

// درخواست مجوز
const granted = await requestNotificationPermission();
```

---

## 📊 امتیاز Lighthouse

انتظار می‌ره بازی این امتیازات رو بگیره:

- **Performance**: 95+ ⚡
- **PWA**: 100 ✅
- **Accessibility**: 90+ ♿
- **Best Practices**: 100 ✅
- **SEO**: 90+ 🔍

---

## 🎮 تجربه کاربری

### بعد از نصب:
- ✅ آیکون بازی روی صفحه اصلی ظاهر میشه
- ✅ بدون نوار مرورگر اجرا میشه
- ✅ مثل اپ نیتیو احساس میشه
- ✅ آفلاین هم کار می‌کنه
- ✅ سریع لود میشه

---

## 🔄 آپدیت بازی

وقتی تغییرات جدید push بشه:
1. GitHub Actions خودکار بیلد می‌کنه
2. Service Worker نسخه جدید رو تشخیص میده
3. نوتیفیکیشن آپدیت نمایش داده میشه
4. کاربر می‌تونه بازی رو رفرش کنه

---

## ⚠️ نکات مهم

### HTTPS الزامی است
Service Worker فقط روی HTTPS کار می‌کنه. GitHub Pages خودکار HTTPS داره.

### iOS محدودیت‌ها
- iOS از Push Notification پشتیبانی نمی‌کنه (تا iOS 16.4)
- Splash screen ثابت (SVG پشتیبانی نمیشه)
- محدودیت حافظه کش

### مرورگرهای پشتیبانی شده
- ✅ Chrome 70+
- ✅ Firefox 65+
- ✅ Safari 11.1+
- ✅ Edge 79+
- ✅ Samsung Internet

---

## 🎯 خلاصه

بازی Turbo Rush الان یه PWA کامله که:
- 📲 قابل نصب روی موبایل و دسکتاپ
- 🌐 آفلاین کار می‌کنه
- ⚡ سریع و بهینه
- 🎨 آیکون و splash screen اختصاصی
- 🔄 آپدیت خودکار
- 🔒 امن (HTTPS)

**آموز نصب و بازی کنید! 🏁**
