
import React from 'react';
import { BookOpen, Award, ShieldCheck, Heart, History } from 'lucide-react';

const AboutPage: React.FC = () => {
    return (
        <div className="px-6 py-10 pb-24 space-y-12 animate-fadeIn max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gold/10 rounded-[30px] flex items-center justify-center mx-auto mb-6 rotate-3">
                    <BookOpen size={40} className="text-gold" />
                </div>
                <h1 className="text-4xl font-amiri font-bold text-gray-900 leading-tight">عن الأرشيـف الرقمي</h1>
                <div className="w-16 h-1 bg-gold/30 rounded-full mx-auto"></div>
                <p className="text-gray-500 font-medium">مؤسسة ثقافية توثيقية لموكب عزاء جدحفص</p>
            </div>

            {/* Main Content Sections */}
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex gap-6">
                    <div className="p-4 bg-gray-50 rounded-3xl h-fit">
                        <History className="text-gold" size={24} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">رؤيتنا</h3>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            نسعى لأن نكون المرجع الرقمي الأول والشامل لكافة القصائد والأطوار الحسينية التي صدحت بها حناجر الرواديد في موكب عزاء جدحفص على مر العصور.
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex gap-6">
                    <div className="p-4 bg-gray-50 rounded-3xl h-fit">
                        <Award className="text-gold" size={24} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">أهدافنا</h3>
                        <ul className="text-gray-500 leading-relaxed text-sm space-y-2 list-disc list-inside">
                            <li>حفظ التراث الحسيني من الضياع.</li>
                            <li>تسهيل وصول الشعراء والرواديد والباحثين للمحتوى.</li>
                            <li>توثيق القصائد بالكلمات والملفات الصوتية والمرئية.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm p-10 rounded-[50px] border-2 border-dashed border-gold/20 text-center space-y-4">
                    <Heart className="text-gold mx-auto fill-gold/10" size={32} />
                    <p className="text-gray-800 font-bold text-lg font-amiri italic">
                        "الأرشيف عمل تطوعي يهدف لخدمة قضية الإمام الحسين عليه السلام وتخليد تراث هذا الموكب العريق."
                    </p>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gray-900 text-white rounded-[32px] text-center space-y-2">
                    <ShieldCheck size={24} className="mx-auto text-gold" />
                    <h4 className="text-xs font-black uppercase tracking-tighter">موثوقية المحتوى</h4>
                    <p className="text-[10px] text-gray-400">تدقيق لغوي وتاريخي</p>
                </div>
                <div className="p-6 bg-gold text-white rounded-[32px] text-center space-y-2">
                    <BookOpen size={24} className="mx-auto text-white" />
                    <h4 className="text-xs font-black uppercase tracking-tighter">مكتبة شاملة</h4>
                    <p className="text-[10px] text-white/70">آلاف القصائد المؤرشفة</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
