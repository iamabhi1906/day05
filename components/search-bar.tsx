'use client';

import { Search } from '@mui/icons-material';
import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface SearchBarProps {
  label: string;
  query: string;
  setQuery: (value: string) => void;
}

export default function SearchBar({ label, query, setQuery }: SearchBarProps) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(value);
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, setQuery]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <TextField label={label} variant="standard" value={value} onChange={(e) => setValue(e.target.value)} />
      <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
    </Box>
  );
}
