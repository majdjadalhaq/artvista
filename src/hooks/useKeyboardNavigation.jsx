import { useEffect } from 'react';

export const useKeyboardNavigation = (handlers = {}) => {
    const { onEscape, onEnter, onArrowLeft, onArrowRight } = handlers;

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'Escape':
                    if (onEscape) onEscape();
                    break;
                case 'Enter':
                    if (onEnter) onEnter();
                    break;
                case 'ArrowLeft':
                    if (onArrowLeft) onArrowLeft();
                    break;
                case 'ArrowRight':
                    if (onArrowRight) onArrowRight();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
};
