'use client';
import { getPublishedProducts } from '@/lib/crud/product';
import { Alert, Grid, Snackbar, Box, CircularProgress, Typography, Stack } from '@mui/material';
import ProductCard from './product-card';
import ProductSideBar from './product-side-bar';
import { useState, useCallback } from 'react';
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

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleFiltersChange = async (newFilters: GetPublishedProductsParams) => {
    await loadProducts(newFilters);
  };

  const loadProducts = useCallback(async (params: GetPublishedProductsParams) => {
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
  }, []);

  const fetchMoreProducts = useCallback(async () => {
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
      setNotification({
        open: true,
        message: 'Failed to load more products.',
        severity: 'error',
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, filters]);

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} className={styles.layout}>
        <Box className={styles.sidebarColumn}>
          <ProductSideBar filters={filters} onChangeFilters={handleFiltersChange} />
        </Box>

        <Box className={styles.contentColumn}>
          {visibleProducts.length === 0 ? (
            <Typography className={styles.emptyState}>No products found for this category.</Typography>
          ) : (
            <InfiniteScroll
              dataLength={visibleProducts.length}
              next={fetchMoreProducts}
              hasMore={hasMore && !isLoadingMore}
              loader={
                <Box className={styles.loader}>
                  <CircularProgress />
                </Box>
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
      </Stack>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification((current) => ({ ...current, open: false }))}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </>
  );
}
