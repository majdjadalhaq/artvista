import { useToast } from '../../context/ToastContext';
import Toast from './Toast';
import { AnimatePresence } from 'framer-motion';

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onRemove={removeToast}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
