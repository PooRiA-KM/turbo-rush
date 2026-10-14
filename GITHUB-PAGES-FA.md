# 🏎️ راهنمای نصب روی GitHub Pages

## ✅ بله! کاملاً امکان‌پذیره!

بازی **Turbo Rush** رو می‌تونید روی GitHub Pages با یه ساب‌دامین رایگان اجرا کنید.

---

## 📋 مراحل قدم به قدم

### ۱. ریپازیتوری GitHub بسازید

```bash
# یه پوشه جدید بسازید
mkdir turbo-rush
cd turbo-rush

# فایل‌های پروژه رو کپی کنید (یا git clone بزنید)
git init
git add .
git commit -m "Initial commit - Turbo Rush Racing Game"
```

### ۲. ریپازیتوری رو به GitHub پوش کنید

```bash
# روی GitHub یه ریپازیتوری جدید بسازید (مثلاً turbo-rush)
git remote add origin https://github.com/YOUR-USERNAME/turbo-rush.git
git branch -M main
git push -u origin main
```

### ۳. فعال‌سازی GitHub Pages

1. به ریپازیتوری برید: `https://github.com/YOUR-USERNAME/turbo-rush`
2. به بخش **Settings** برید
3. از منوی سمت چپ **Pages** رو انتخاب کنید
4. در قسمت **Source** گزینه **GitHub Actions** رو انتخاب کنید
5. تمام! 🎉

### ۴. آدرس بازی شما

بازی شما در این آدرس در دسترس خواهد بود:

```
https://YOUR-USERNAME.github.io/turbo-rush/
```

---

## 🌐 استفاده با ساب‌دامین اختصاصی

اگه دامنه اختصاصی دارید (مثلاً `game.mysite.com`)، می‌تونید:

### روش ۱: CNAME

1. یه فایل `CNAME` در پوشه `public/` بسازید:
```bash
echo "game.mysite.com" > public/CNAME
```

2. در تنظیمات DNS دامنه‌تون، یه رکورد **CNAME** بسازید:
```
Type: CNAME
Name: game (یا ساب‌دامین دلخواه)
Value: YOUR-USERNAME.github.io
```

3. در تنظیمات GitHub Pages، دامنه رو وارد کنید:
   - Settings → Pages → Custom domain
   - `game.mysite.com` رو وارد کنید
   - تیک **Enforce HTTPS** رو بزنید

### روش ۲: استفاده از Cloudflare Pages (رایگان + سریع‌تر)

1. به [cloudflare.com/pages](https://pages.cloudflare.com) برید
2. ریپازیتوری GitHub رو متصل کنید
3. تنظیمات Build:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output**: `dist`
4. ساب‌دامین رایگان دریافت کنید: `turbo-rush.pages.dev`

---

## 🔄 آپدیت خودکار

هر بار که تغییرات رو push کنید، GitHub Actions به صورت خودکار:
1. پروژه رو build می‌کنه
2. فایل‌های جدید رو deploy می‌کنه
3. بازی آپدیت میشه! 🚀

---

## ⚠️ نکات مهم

### اگر بازی در ساب‌پوشه deploy میشه:

اگه آدرس بازی شما `https://username.github.io/turbo-rush/` هست، باید `base` رو در `vite.config.js` تنظیم کنید. اما چون من نمی‌تونم اون فایل رو مستقیماً ویرایش کنم، یه راه‌حل دیگه داریم:

فایل `.github/workflows/deploy.yml` رو ایجاد کردم که خودکار همه چیز رو هندل می‌کنه.

### اگر صفحه سفید نمایش داده میشه:

1. کنسول مرورگر رو باز کنید (F12)
2. ببینید آیا خطای 404 برای فایل‌های JS/CSS وجود داره
3. اگر بله، باید `base` رو در vite config تنظیم کنید

---

## 🎮 کنترل‌های بازی

| کلید | عملکرد |
|------|--------|
| ← → یا A/D | حرکت چپ/راست |
| ↑ یا W | افزایش سرعت |
| ↓ یا S | ترمز |
| ESC | توقف/ادامه |

📱 در موبایل، دکمه‌های لمسی در پایین صفحه ظاهر می‌شن.

---

## 📊 وضعیت CI/CD

بعد از push، می‌تونید وضعیت deploy رو اینجا ببینید:
```
https://github.com/YOUR-USERNAME/turbo-rush/actions
```

---

## 🎯 خلاصه

| ویژگی | وضعیت |
|--------|--------|
| GitHub Pages | ✅ پشتیبانی می‌شه |
| ساب‌دامین رایگان | ✅ `username.github.io` |
| دامنه اختصاصی | ✅ با CNAME |
| HTTPS | ✅ خودکار |
| CI/CD خودکار | ✅ با GitHub Actions |
| موبایل ریسپانسیو | ✅ کامل |
| بدون سرور بک‌اند | ✅ Static site |

---

**موفق باشید! 🏁**
