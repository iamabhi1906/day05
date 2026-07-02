'use client';
import { getPublishedProducts } from '@/lib/crud/product';
import { Button, Grid, Box, Typography, Stack, Skeleton } from '@mui/material';
import ProductCard from './product-card';
import ProductSideBar from './product-side-bar';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GetPublishedProductsParams, ProductData } from '@/features/product/product.types';
import styles from './product-display.module.css';

interface props {
  products: ProductData[];
  lastDoc: string | null;
}

export default function ProductDisplay({ products, lastDoc }: props) {
  const [visibleProducts, setProducts] = useState<ProductData[]>(products);
  const [hasMore, setHasMore] = useState<boolean>(lastDoc !== null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [filters, setFilters] = useState<GetPublishedProductsParams>({ limit: 12, category: null, search: '', lastDocId: lastDoc });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleFiltersChange = async (newFilters: GetPublishedProductsParams) => {
    await loadProducts(newFilters);
    setMobileSidebarOpen(false);
  };

  const loadProducts = async (params: GetPublishedProductsParams) => {
    try {
      const { data, lastDocId } = await getPublishedProducts({
        ...params,
        lastDocId: null,
      });
      setProducts(data);
      setHasMore(lastDocId !== null);
      setFilters((prev) => ({ ...prev, ...params, lastDocId }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoreProducts = async () => {
    if (isLoadingMore || !filters) return;
    setIsLoadingMore(true);
    try {
      const { data, lastDocId } = await getPublishedProducts(filters);
      if (data.length > 0) {
        setProducts((current) => [...current, ...data]);
        setFilters((prev) => ({ ...prev, lastDocId }));
        setHasMore(lastDocId !== null);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log('Failed to load more products:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} className={styles.productDisplayContainer}>
      <ProductSideBar filters={filters} onChangeFilters={handleFiltersChange} />

      <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', height: 'calc(100vh - 115px)' }}>
        {visibleProducts.length === 0 ? (
          <Typography className={styles.emptyState}>No products found for this category.</Typography>
        ) : (
          <InfiniteScroll
            dataLength={visibleProducts.length}
            next={fetchMoreProducts}
            hasMore={hasMore && !isLoadingMore}
            loader={
              <Grid container spacing={3}>
                {Array.from(new Array(8)).map((_, index) => (
                  <Grid container key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Skeleton variant="rounded" width="100%" height={200} sx={{ mb: 2, borderRadius: 2 }} />
                    <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                      <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
                      <Skeleton variant="text" width="60%" height={24} />
                    </Stack>
                    <Skeleton variant="text" width="30%" height={20} sx={{ mb: 2 }} />
                    <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 'auto', borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            }
            endMessage={<Typography className={styles.endMessage}>No more products to load</Typography>}
          >
            <Grid container spacing={1}>
              {visibleProducts.map((product) => {
                return (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
                    <ProductCard product={product} />
                  </Grid>
                );
              })}
            </Grid>
          </InfiniteScroll>
        )}
      </Box>

      <Box className={styles.mobileSidebarButtonContainer}>
        <Button variant="contained" color="primary" onClick={() => setMobileSidebarOpen(true)} className={styles.mobileSidebarButton}>
          Show filters
        </Button>
      </Box>

      <Box className={mobileSidebarOpen ? `${styles.mobileSidebarOverlay} ${styles.open}` : styles.mobileSidebarOverlay}>
        <Box className={styles.mobileSidebarContent}>
          <Stack direction="row">
            <Typography variant="h6">Filters</Typography>
            <Button color="inherit" onClick={() => setMobileSidebarOpen(false)}>
              Close
            </Button>
          </Stack>
          <ProductSideBar filters={filters} onChangeFilters={handleFiltersChange} />
        </Box>
      </Box>
    </Stack>
  );
}
