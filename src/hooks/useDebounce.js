import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * Delays updating the value until after the specified delay
 * Useful for search inputs to avoid excessive API calls
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {any} Debounced value
 */
function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if value changes before delay expires
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
