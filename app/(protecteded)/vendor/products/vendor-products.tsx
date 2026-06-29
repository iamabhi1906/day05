'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import SaveIcon from '@mui/icons-material/Save';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { createProduct, deleteProduct, ProductData, ProductInput, ProductStatus, updateProduct } from '@/lib/crud/product';
import { UserData } from '@/lib/crud/user';

type ProductFormState = {
  id: string | null;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageUrl: string;
  imagePublicId: string;
  status: ProductStatus;
};

type NotificationState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

type CloudinaryInfo = {
  secure_url?: string;
  public_id?: string;
};

const emptyForm: ProductFormState = {
  id: null,
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
  imageUrl: '',
  imagePublicId: '',
  status: 'draft',
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const toProductInput = (form: ProductFormState, user: UserData): ProductInput => ({
  name: form.name.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  stock: Number(form.stock),
  category: form.category.trim(),
  imageUrl: form.imageUrl,
  imagePublicId: form.imagePublicId,
  status: form.status,
  vendorEmail: user.email,
  vendorName: user.name || user.email,
});

export default function VendorProducts({
  initialProducts,
  user,
}: {
  initialProducts: ProductData[];
  user: UserData;
}) {
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: NotificationState['severity']) => {
    setNotification({ open: true, message, severity });
  };

  const updateForm = (field: keyof ProductFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      throw new Error('Name, description, and category are required.');
    }
    if (!form.imageUrl) {
      throw new Error('Please upload a product image.');
    }
    if (Number(form.price) <= 0) {
      throw new Error('Price must be greater than zero.');
    }
    if (Number(form.stock) < 0) {
      throw new Error('Stock cannot be negative.');
    }
  };

  const refreshProducts = async () => {
    const nextProducts = await import('@/lib/crud/product').then((module) => module.getVendorProducts(user.email));
    setProducts(nextProducts);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      validateForm();
      const payload = toProductInput(form, user);

      if (form.id) {
        await updateProduct(form.id, payload);
        showNotification('Product updated.', 'success');
      } else {
        await createProduct(payload);
        showNotification('Product created.', 'success');
      }

      await refreshProducts();
      resetForm();
    } catch (error: unknown) {
      showNotification(error instanceof Error ? error.message : 'Unable to save product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ProductData) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      imageUrl: product.imageUrl,
      imagePublicId: product.imagePublicId,
      status: product.status,
    });
  };

  const handleDelete = async (productId: string) => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
      showNotification('Product deleted.', 'success');
      if (form.id === productId) resetForm();
    } catch {
      showNotification('Unable to delete product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as CloudinaryInfo;
    if (!info.secure_url || !info.public_id) return;

    setForm((current) => ({
      ...current,
      imageUrl: info.secure_url || '',
      imagePublicId: info.public_id || '',
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
        <InventoryIcon color="primary" />
        <Typography variant="h5">Vendor Products</Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{form.id ? 'Edit product' : 'Add product'}</Typography>
                <TextField label="Name" value={form.name} onChange={(event) => updateForm('name', event.target.value)} fullWidth />
                <TextField
                  label="Description"
                  value={form.description}
                  onChange={(event) => updateForm('description', event.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <TextField label="Category" value={form.category} onChange={(event) => updateForm('category', event.target.value)} fullWidth />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Price"
                    type="number"
                    value={form.price}
                    onChange={(event) => updateForm('price', event.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Stock"
                    type="number"
                    value={form.stock}
                    onChange={(event) => updateForm('stock', event.target.value)}
                    fullWidth
                  />
                </Stack>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={form.status}
                    onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ProductStatus }))}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </Select>
                </FormControl>

                {form.imageUrl ? (
                  <CardMedia component="img" image={form.imageUrl} alt={form.name || 'Product image'} sx={{ height: 180, borderRadius: 1 }} />
                ) : null}

                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  options={{ multiple: false, folder: 'stylestreet-products' }}
                  onSuccess={handleUploadSuccess}
                >
                  {({ open, isLoading }) => (
                    <Button
                      variant="outlined"
                      startIcon={<AddPhotoAlternateIcon />}
                      disabled={isLoading || loading}
                      onClick={() => open()}
                    >
                      Upload image
                    </Button>
                  )}
                </CldUploadWidget>

                <Stack direction="row" spacing={1}>
                  <Button variant="contained" startIcon={<SaveIcon />} disabled={loading} onClick={handleSubmit}>
                    {form.id ? 'Update' : 'Save'}
                  </Button>
                  <Button variant="outlined" disabled={loading} onClick={resetForm}>
                    Clear
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
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
                  <TableRow key={product.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <CardMedia
                          component="img"
                          image={product.imageUrl}
                          alt={product.name}
                          sx={{ width: 56, height: 56, borderRadius: 1 }}
                        />
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
                      <Chip
                        label={product.status}
                        color={product.status === 'published' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                        <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(product)}>
                          Edit
                        </Button>
                        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(product.id)}>
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
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
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((current) => ({ ...current, open: false }))}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}
