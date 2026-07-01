import { getPublishedProducts } from '@/lib/crud/product';
import { Box, Stack, Typography } from '@mui/material';
import { Storefront } from '@mui/icons-material';
import ProductDisplay from './components/product-display';
import styles from './page.module.css';

export default async function Page() {
  const { data, lastDocId } = await getPublishedProducts({});
  return (
    <Box className={styles.page}>
      <Stack direction="row" spacing={1.5} className={styles.header}>
        <Storefront color="primary" />
        <Typography variant="h5">Products</Typography>
      </Stack>
      <ProductDisplay products={data} lastDoc={lastDocId} />
    </Box>
  );
}
