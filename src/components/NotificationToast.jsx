import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message } = toast;

  const iconMap = {
    success: <CheckCircle2 size={20} color="var(--accent-green)" />,
    error: <AlertTriangle size={20} color="var(--accent-red)" />,
    info: <Info size={20} color="var(--accent-purple)" />,
  };

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast toast-${type}`}>
        {iconMap[type] || iconMap.info}
        <span style={{ fontSize: '0.9rem', flex: 1, fontWeight: 500, color: 'var(--text-main)' }}>
          {message}
        </span>
        <button 
          onClick={onClose} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
