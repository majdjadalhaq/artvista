import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export const useSearchAndFilter = (initialDelay = 500) => {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        artist: "",
        era: "",
        medium: "",
    });

    const debouncedSearch = useDebounce(search, initialDelay);

    const handleSearchChange = (value) => {
        if (value.length <= 50) {
            setSearch(value);
        }
    };

    const clearFilters = () => {
        setFilters({ artist: "", era: "", medium: "" });
        setSearch("");
    };

    return {
        search,
        setSearch: handleSearchChange,
        debouncedSearch,
        filters,
        setFilters,
        clearFilters
    };
};
