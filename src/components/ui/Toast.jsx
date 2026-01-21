import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const icons = {
    success: <CheckCircle size={20} className="text-green-400" />,
    error: <AlertCircle size={20} className="text-red-400" />,
    info: <Info size={20} className="text-blue-400" />
};

export default function Toast({ id, message, type = 'info', onRemove }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 w-80 p-4 rounded-lg shadow-lg backdrop-blur-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] pointer-events-auto"
        >
            <div className="flex-shrink-0">
                {icons[type] || icons.info}
            </div>
            <p className="flex-grow text-sm font-medium">{message}</p>
            <button
                onClick={() => onRemove(id)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Close"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}
