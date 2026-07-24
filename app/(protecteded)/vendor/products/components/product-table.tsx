'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Divider,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { ProductData, ProductStatus } from '@/features/product/product.types';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

type ProductTableRowProps = {
  product: ProductData;
  onEdit: (product: ProductData) => void;
  onDelete: (productId: string) => void;
  onStatusChange: (product: ProductData, status: ProductStatus) => void;
};

function ProductTableRow({ product, onEdit, onDelete, onStatusChange }: ProductTableRowProps) {
  const isPublished = product.status === ProductStatus.PUBLISHED;

  return (
    <TableRow>
      <TableCell>
        <Stack direction="row" spacing={1.5}>
          <CardMedia
            component="img"
            image={product.productImages?.[0]}
            alt={product.title}
            sx={{
              width: 56,
              height: 56,
              borderRadius: 1,
              objectFit: 'cover',
            }}
          />

          <Box>
            <Typography variant="subtitle2">{product.title}</Typography>
            <Typography variant="caption" color="text.secondary">
              {product.category}
            </Typography>
          </Box>
        </Stack>
      </TableCell>

      <TableCell>{currency.format(product.price)}</TableCell>

      <TableCell>{product.stock}</TableCell>

      <TableCell>
        <Stack direction="row" spacing={1}>
          <Switch
            checked={isPublished}
            color="success"
            onChange={(e) => onStatusChange(product, e.target.checked ? ProductStatus.PUBLISHED : ProductStatus.DRAFT)}
          />

          <Chip label={product.status} color={isPublished ? 'success' : 'default'} size="small" sx={{ textTransform: 'uppercase' }} />
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={1}>
          <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(product)}>
            Edit
          </Button>

          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(product.id)}>
            Delete
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

type ProductTableProps = {
  products: ProductData[];
  onEdit: (product: ProductData) => void;
  onDelete: (productId: string) => void;
  onStatusChange: (product: ProductData, status: ProductStatus) => void;
};

export function ProductTable({ products, onEdit, onDelete, onStatusChange }: ProductTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductTableRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>
                <Stack spacing={1.5}>
                  <Divider flexItem />
                  <Typography color="text.secondary">No products yet.</Typography>
                </Stack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
