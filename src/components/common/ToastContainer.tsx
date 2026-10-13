import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let borderClass = 'border-cyan-500/40 bg-[#071B38]/95 text-cyan-200';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-[#16D6B0]/50 bg-[#071B38]/95 text-[#16D6B0]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/50 bg-[#071B38]/95 text-rose-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${borderClass}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1 text-[#EAF3FF] leading-snug">
              {toast.text}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8EA9CF] hover:text-white p-0.5 rounded transition"
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
