
import React, { useState } from 'react';
import { Mail, Send, Phone, MapPin, Instagram, Youtube } from 'lucide-react';

const ContactPage: React.FC = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="px-6 py-10 pb-24 space-y-10 animate-fadeIn max-w-2xl mx-auto">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-amiri font-bold text-gray-900 leading-tight">تواصـل معنا</h1>
                <p className="text-gray-500 font-medium">نرحب بملاحظاتكم واقتراحاتكم لتزويد الأرشيف بالقصائد</p>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold">
                        <Phone size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">واتساب</p>
                        <p className="font-bold text-gray-800" dir="ltr">+973 0000 0000</p>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-red-50 rounded-2xl text-red-500">
                        <Youtube size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">يوتيوب</p>
                        <p className="font-bold text-gray-800">موكب عزاء جدحفص</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100">
                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 mr-2">الاسم</label>
                                <input required type="text" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-gold/20" placeholder="أدخل اسمك" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 mr-2">نص الرسالة</label>
                                <textarea required rows={4} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-gold/20" placeholder="كيف يمكننا مساعدتك؟"></textarea>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all">
                            <Send size={20} />
                            إرسال الرسالة
                        </button>
                    </form>
                ) : (
                    <div className="py-10 text-center space-y-4">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <Send size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">تم الإرسال بنجاح!</h3>
                        <p className="text-gray-500">شكراً لتواصلك معنا، سنرد عليك في أقرب وقت.</p>
                        <button onClick={() => setSent(false)} className="text-gold font-bold underline">إرسال رسالة أخرى</button>
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="flex justify-center gap-6">
                <a href="#" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-pink-600">
                    <Instagram size={24} />
                </a>
                <a href="#" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 text-blue-600">
                    <MapPin size={24} />
                </a>
            </div>
        </div>
    );
};

export default ContactPage;
