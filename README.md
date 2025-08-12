# Shevoo Store - متجر ملابس عربي

موقع متجر ملابس احترافي مبني بـ React و Tailwind CSS و Firebase.

## المميزات

### الصفحة الرئيسية
- ✅ سلايدر علوي مع رسائل ترويجية
- ✅ ناف بار مع سلة مشتريات
- ✅ هيرو سكشن مع صورة خلفية
- ✅ سلايدر المنتجات الحديثة
- ✅ عرض الفئات (T-Shirt, Pants, Shoes)
- ✅ عرض آخر منتج مضاف
- ✅ نموذج الشكاوى مع إرسال للواتساب
- ✅ فوتر مع روابط التواصل

### صفحة المنتجات
- ✅ سيرش متقدم
- ✅ فلتر حسب الفئة
- ✅ كاردات منتجات مع سلايدر صور
- ✅ تصميم متجاوب

### صفحة تفاصيل المنتج
- ✅ سلايدر صور تفاعلي
- ✅ اختيار المقاس واللون
- ✅ عداد الكمية
- ✅ إضافة للسلة أو الشراء المباشر

### سلة المشتريات
- ✅ عرض المنتجات المختارة
- ✅ تعديل الكميات
- ✅ حساب التوتل مع التوصيل
- ✅ الانتقال للتشيك اوت

### صفحة التشيك اوت
- ✅ ملخص الطلب
- ✅ نموذج بيانات العميل
- ✅ التحقق من صحة البيانات
- ✅ إتمام الطلب

### لوحة تحكم الأدمن
- ✅ تسجيل دخول آمن
- ✅ إضافة منتجات جديدة
- ✅ إدارة المنتجات (حذف/تعديل)
- ✅ إدارة الطلبات وحالاتها

## التقنيات المستخدمة

- **Frontend**: React 18, Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **UI Components**: React Icons, Swiper
- **Notifications**: SweetAlert2
- **Backend**: Firebase (Firestore, Storage, Auth)

## التثبيت والتشغيل

### المتطلبات
- Node.js (v16 أو أحدث)
- npm أو yarn

### خطوات التثبيت

1. استنساخ المشروع:
```bash
git clone <repository-url>
cd shevoo-store
```

2. تثبيت المكتبات:
```bash
npm install
```

3. إعداد Firebase:
   - إنشاء مشروع Firebase جديد
   - تفعيل Firestore Database
   - تفعيل Firebase Storage
   - تفعيل Firebase Authentication
   - نسخ بيانات التكوين إلى `src/firebase/config.js`

4. تشغيل المشروع:
```bash
npm start
```

5. فتح المتصفح على:
```
http://localhost:3000
```

## بيانات تسجيل دخول الأدمن

- **البريد الإلكتروني**: admin@shevoo.com
- **كلمة المرور**: admin123

## هيكل المشروع

```
src/
├── components/
│   ├── admin/
│   │   ├── AddProduct.js
│   │   ├── ManageProducts.js
│   │   └── Orders.js
│   ├── Navbar.js
│   ├── HeroSection.js
│   ├── ProductSlider.js
│   ├── Categories.js
│   ├── FeaturedProduct.js
│   ├── ContactForm.js
│   ├── Footer.js
│   └── ProductCard.js
├── pages/
│   ├── Home.js
│   ├── Products.js
│   ├── ProductDetail.js
│   ├── Cart.js
│   ├── Checkout.js
│   ├── AdminLogin.js
│   └── AdminDashboard.js
├── context/
│   └── CartContext.js
├── firebase/
│   └── config.js
├── App.js
└── index.js
```

## المميزات التقنية

### التصميم المتجاوب
- تصميم متوافق مع جميع الأجهزة
- تحسين للهواتف المحمولة
- واجهة مستخدم عربية

### الأداء
- تحميل سريع للصفحات
- تحسين الصور
- كود نظيف ومنظم

### الأمان
- حماية صفحات الأدمن
- التحقق من صحة البيانات
- تشفير كلمات المرور

## المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## التواصل

- **الواتساب**: 01002107088
- **الانستجرام**: [@shevoo_store](https://www.instagram.com/shevoo_store?igsh=MWdycDl6Mm1kaDNzaQ==)

## الدعم

للدعم الفني أو الاستفسارات، يرجى التواصل عبر:
- البريد الإلكتروني: support@shevoo.com
- الواتساب: 01002107088
