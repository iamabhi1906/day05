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
    <Box
      component="aside"
      className={styles.sidebar}
      sx={{
        position: 'sticky',
        top: '24px',
        height: 'calc(100vh - 48px)',
        overflowY: 'auto',
        width: '220px',
        flexShrink: 0,
      }}
    >
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
              const CategoryIcon = category.icon;

              return (
                <div key={`categories.values+${index}`}>
                  <Button
                    color={isSelected ? 'primary' : 'inherit'}
                    className={styles.categoryButton}
                    startIcon={<CategoryIcon fontSize="small" />}
                    endIcon={isSelected ? <Check color="primary" /> : undefined}
                    onClick={() => onChangeFilters({ category: category.value })}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    {category.label}
                  </Button>
                  <Divider />
                </div>
              );
            })}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
