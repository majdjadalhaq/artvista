import { useState, useEffect } from 'react';

export const useSearchAndFilter = (initialDelay = 500) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState({
        artist: null,
        era: null,
    });

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, initialDelay);

        return () => clearTimeout(timer);
    }, [search, initialDelay]);

    const handleSearchChange = (value) => {
        if (value.length <= 50) {
            setSearch(value);
        }
    };

    const clearFilters = () => {
        setFilters({ artist: null, era: null });
        setSearch("");
    };

    return {
        search,
        setSearch: handleSearchChange, // Enforce max length check
        debouncedSearch,
        filters,
        setFilters,
        clearFilters
    };
};
