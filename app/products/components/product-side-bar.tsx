'use client';

import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { GetPublishedProductsParams } from '@/features/product/product.types';
import styles from './product-side-bar.module.css';
import { categories } from './product-categories';
import SearchBar from '@/components/search-bar';
import { Check } from '@mui/icons-material';

type ProductSideBarProps = {
  filters: GetPublishedProductsParams | null;
  onChangeFilters: (filters: GetPublishedProductsParams) => void;
};

export default function ProductSideBar({ filters, onChangeFilters }: ProductSideBarProps) {
  return (
    <aside className={styles.sidebar}>
      <Typography variant="h6" gutterBottom className={styles.title}>
        Product Filter
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Narrow down by search term or category to find your next favorite item.
      </Typography>
      <Stack spacing={1.5}>
        <SearchBar
          label="Search Your Product"
          query={filters?.search || ''}
          setQuery={(query) => {
            onChangeFilters({ search: query });
          }}
        />

        <Box>
          <Stack direction={'column'} spacing={1}>
            {categories.map((category, index) => {
              const isSelected = filters?.category === category.value;
              return (
                <Box key={`categories.values+${index}`}>
                  <Button
                    key={category.label}
                    color={isSelected ? 'primary' : 'inherit'}
                    className={styles.categoryButton}
                    variant={isSelected ? 'contained' : 'text'}
                    onClick={() => onChangeFilters({ category: category.value })}
                  >
                    {filters?.category === category.value && <Check color="primary" />}
                    {category.label}
                  </Button>
                  {index < categories.length - 1 ? <Divider sx={{ my: 0.5 }} /> : null}
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </aside>
  );
}
