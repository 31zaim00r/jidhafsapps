<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# مأتم بن رجب - أرشيف القصائد

هذا المشروع هو منصة رقمية لأرشفة وإدارة القصائد الشعرية والألحان، مع دعم كامل لملفات PDF ونظام صلاحيات متطور.

## المتطلبات الأساسية
- **Node.js**: الإصدار 18 أو أحدث.

## التشغيل المحلي (Linux/Mac)
1. تثبيت المكتبات: `npm install`
2. تشغيل المشروع: `npm run dev`

## التشغيل المحلي (Windows)
في حال واجهت مشكلة في تشغيل `npm` بسبب "Execution Policy"، استخدم الأوامر التالية:
1. تثبيت المكتبات: `npm.cmd install`
2. تشغيل المشروع: `npm.cmd run dev`

## إعداد قاعدة البيانات (Supabase)
لقد تم توحيد هيكل قاعدة البيانات في ملف واحد: `supabase/schema.sql`.
1. قم بإنشاء مشروع جديد في Supabase.
2. انسخ محتويات ملف `supabase/schema.sql` والصقها في **SQL Editor** داخل لوحة تحكم Supabase.
3. قم بتحديث بيانات المشروع في ملف `.env`.
