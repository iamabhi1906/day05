'use client';
import { Search } from '@mui/icons-material';
import { Box, TextField } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';

type AnyFn = (...args: any[]) => void;

function debounce<T extends AnyFn>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>): void => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

interface SearchBarProps {
  label: string;
  query: string;
  setQuery: (value: string) => void;
}

export default function SearchBar({ label, query, setQuery }: SearchBarProps) {
  const setQueryRef = useRef(setQuery);
  useEffect(() => {
    setQueryRef.current = setQuery;
  }, [setQuery]);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setQueryRef.current(term);
    }, 300),
    [],
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
      <TextField label={label} variant="standard" onChange={(e) => debouncedSearch(e.target.value)} defaultValue={query} />
      <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
    </Box>
  );
}
