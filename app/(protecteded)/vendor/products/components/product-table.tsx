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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ProductTableRowProps } from '../types';
import type { ProductData } from '@/lib/crud/product';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
});

function ProductTableRow({ product, onEdit, onDelete }: ProductTableRowProps) {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <CardMedia component="img" image={product.imageUrl} alt={product.name} sx={{ width: 56, height: 56, borderRadius: 1 }} />
          <Box>
            <Typography variant="subtitle2">{product.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {product.category}
            </Typography>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>{currency.format(product.price)}</TableCell>
      <TableCell>{product.stock}</TableCell>
      <TableCell>
        <Chip label={product.status} color={product.status === 'published' ? 'success' : 'default'} size="small" />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
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
};

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
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
          {products.map((product) => (
            <ProductTableRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Stack spacing={1.5} sx={{ py: 5, alignItems: 'center' }}>
                  <Divider flexItem />
                  <Typography color="text.secondary">No products yet.</Typography>
                </Stack>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
