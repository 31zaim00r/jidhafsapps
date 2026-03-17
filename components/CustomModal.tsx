
import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'danger' | 'warning';
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showInput?: boolean;
    inputValue?: string;
    onInputChange?: (val: string) => void;
    placeholder?: string;
}

const CustomModal: React.FC<ModalProps> = ({
    isOpen, title, message, type = 'info', onConfirm, onCancel, confirmText = 'موافق', cancelText = 'إلغاء',
    showInput, inputValue, onInputChange, placeholder = "أدخل القيمة هنا..."
}) => {
    if (!isOpen) return null;

    const colors = {
        info: 'text-blue-600 bg-blue-50',
        success: 'text-green-600 bg-green-50',
        danger: 'text-red-600 bg-red-50',
        warning: 'text-orange-600 bg-orange-50'
    };

    const icons = {
        info: <Info size={24} />,
        success: <CheckCircle2 size={24} />,
        danger: <AlertCircle size={24} />,
        warning: <AlertCircle size={24} />
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fadeIn" onClick={onCancel} />
            <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative animate-scaleIn">
                <button onClick={onCancel} className="absolute top-6 left-6 text-gray-300 hover:text-gray-900 transition-colors">
                    <X size={20} />
                </button>

                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${colors[type]}`}>
                    {icons[type]}
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{message}</p>

                {showInput && (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => onInputChange?.(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 mb-6 text-sm font-bold focus:ring-2 focus:ring-gold/20"
                    />
                )}

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className={`w-full py-4 rounded-2xl text-sm font-black transition-all active:scale-95 ${type === 'danger' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-900 text-white shadow-lg shadow-gray-200'}`}
                    >
                        {confirmText}
                    </button>
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="w-full py-4 rounded-2xl text-sm font-black text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
