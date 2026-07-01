'use client';

import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { GetPublishedProductsParams, ProductCategory } from '@/features/product/product.types';
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
      <Stack spacing={1}>
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
                <div key={`categories.values+${index}`}>
                  <Button
                    key={category.label}
                    color={isSelected ? 'primary' : 'inherit'}
                    className={styles.categoryButton}
                    onClick={() => onChangeFilters({ category: category.value })}
                  >
                    {filters?.category === category.value && <Check color="primary" />}
                    {category.label}
                  </Button>
                  <Divider />
                </div>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </aside>
  );
}
