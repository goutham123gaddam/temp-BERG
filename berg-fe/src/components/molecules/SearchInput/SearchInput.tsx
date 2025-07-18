import React, { useState, useEffect } from 'react';
import { Box, IconButton, InputBase } from '@mui/material';
import type { SxProps } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    sx?: SxProps;
}

const SearchInput: React.FC<SearchInputProps> = ({
    onSearch,
    placeholder = 'Search',
    sx = {}
}: SearchInputProps) => {
    const [query, setQuery] = useState('');
    useEffect(() => {
        const timeout = setTimeout(() => {
            onSearch(query.trim());
        }, 300); // 300ms delay

        return () => clearTimeout(timeout);
    }, [query, onSearch]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(query.trim());
        }
    };

    return (
        <Box
            component="form"
            sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffff', borderRadius: '10px', border: '1px solid #E0E0E0', ...sx }}
        >
            <IconButton type="button" sx={{ p: '10px', color: '#BFBFBF' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={placeholder}
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
            />

        </Box>
    );
};

export default SearchInput;
