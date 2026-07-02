import { Card, CardActions, CardContent, Divider, Button, Stack, Typography } from '@mui/material';
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined';
import styles from '../admin.module.css';

type Product = {
  id: string;
  name: string;
  vendorName?: string;
  category?: string;
  price?: number;
  stock?: number;
};

export default function ProductCard({ product, action }: { product: Product; action: any }) {
  return (
    <Card className={styles.cardRoot} variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Stack sx={{ flexDirection: 'row', alignItems: 'center' }} spacing={1}>
            <Typography variant="subtitle1" component="h2">
              {product.name}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Vendor: {product.vendorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Category: {product.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ₹{product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock: {product.stock}
          </Typography>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions className={styles.cardActions}>
        <form action={action} className={styles.actionForm}>
          <input type="hidden" name="productId" value={product.id} />
          <Button type="submit" color="error" variant="outlined" startIcon={<DeleteOutlineOutlined />}>
            Delete
          </Button>
        </form>
      </CardActions>
    </Card>
  );
}
