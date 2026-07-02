'use client';
import { getPublishedProducts } from '@/lib/crud/product';
import { Alert, Box, CircularProgress, Grid, Paper, Skeleton, Snackbar, Stack, Typography } from '@mui/material';
import ProductCard from './product-card';
import ProductSideBar from './product-side-bar';
import { useState, useEffect } from 'react';
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
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<GetPublishedProductsParams>({ limit: 12, category: null, search: '', lastDocId: lastDoc });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setIsInitialLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const loadProducts = async (params: GetPublishedProductsParams) => {
    try {
      setIsInitialLoading(true);
      const { data, lastDocId } = await getPublishedProducts({
        ...params,
        lastDocId: null,
      });
      setProducts(data);
      setHasMore(lastDocId !== null);
      setFilters((prev) => ({ ...prev, ...params, lastDocId }));
    } catch (error) {
      console.error(error);
    } finally {
      window.setTimeout(() => setIsInitialLoading(false), 250);
    }
  };

  const handleFiltersChange = async (newFilters: GetPublishedProductsParams) => {
    await loadProducts(newFilters);
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
      setNotification({
        open: true,
        message: 'Failed to load more products.',
        severity: 'error',
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} className={styles.layout}>
        <Box className={styles.sidebarColumn}>
          <ProductSideBar filters={filters} onChangeFilters={handleFiltersChange} />
        </Box>

        <Box className={styles.contentColumn}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Featured picks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fresh arrivals and curated essentials for your next order.
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {visibleProducts.length} products available
            </Typography>
          </Stack>

          {isInitialLoading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid key={`product-skeleton-${index}`} item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ borderRadius: 3, p: 2, minHeight: 380 }}>
                    <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2, mb: 2 }} />
                    <Skeleton variant="text" width="70%" height={28} />
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="rounded" height={42} sx={{ mt: 2 }} />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : visibleProducts.length === 0 ? (
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
              <Grid container spacing={3}>
                {visibleProducts.map((product) => (
                  <Grid key={product.id} item xs={12} sm={6} md={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
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
