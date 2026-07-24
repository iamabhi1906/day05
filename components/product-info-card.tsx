import { getProduct } from '@/lib/crud/product';
import { Box, Card, CardContent, CardMedia, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import styles from './css/product-info-card.module.css';
import Image from 'next/image';

export default async function ProductInfoCard({ productId }: { productId: string }) {
  const product = await getProduct(productId);
  if (!product) return;

  return (
    <Container maxWidth="sm">
      <Card elevation={0}>
        <Box className={styles.wrapper}>
          <Box className={styles.imageSection}>
            <Image src={product.productImages?.[0]} alt={product.name} className={styles.image} width={200} height={200} />
            <Box>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {product.name}
                </Typography>

                <Chip label={product.status} color={product.status === 'published' ? 'success' : 'default'} size="small" />
              </Stack>

              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={2} className={styles.content}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <LocalOfferOutlinedIcon color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Price
                </Typography>

                <Typography variant="h5" color="primary" sx={{ ml: 'auto', fontWeight: 600 }}>
                  ₹{product.price}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Inventory2OutlinedIcon color="action" />

                <Typography variant="body2" color="text.secondary">
                  Stock
                </Typography>

                <Chip label={`${product.stock} Available`} color={product.stock > 0 ? 'success' : 'error'} size="small" sx={{ ml: 'auto' }} />
              </Stack>

              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CategoryOutlinedIcon color="action" />

                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>

                <Typography variant="body1" sx={{ ml: 'auto', textTransform: 'capitalize', fontWeight: 600 }}>
                  {product.category.replace(/-/g, ' ')}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Vendor
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>{product.vendorName}</Typography>

              <Typography variant="body2" color="text.secondary">
                {product.vendorEmail}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Container>
  );
}
