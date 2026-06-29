'use client';
import { use, useState } from 'react';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { createProduct, deleteProduct, getVendorProducts, ProductData, ProductInput, updateProduct } from '@/lib/crud/product';
import { UserData } from '@/lib/crud/user';
import { ProductFormCard } from './components/product-form-card';
import { ProductTable } from './components/product-table';
import { VendorProductsHeader } from './components/vendor-products-header';
import type { CloudinaryInfo, NotificationState, ProductFormState } from './types';
import { emptyForm } from './types';

const toProductInput = (form: ProductFormState, user: UserData): ProductInput => ({
  name: form.name.trim(),
  description: form.description.trim(),
  price: Number(form.price),
  stock: Number(form.stock),
  category: form.category.trim(),
  imageUrl: form.imageUrls[0] || form.imageUrl,
  imageUrls: form.imageUrls,
  imagePublicId: form.imagePublicId,
  imagePublicIds: form.imagePublicIds,
  status: form.status,
  vendorEmail: user.email,
  vendorName: user.name || user.email,
});

export default function VendorProducts({ initialProducts, user }: { initialProducts: ProductData[]; user: UserData }) {
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
    if (form.imageUrls.length === 0 && !form.imageUrl) {
      throw new Error('Please upload at least one product image.');
    }
    if (Number(form.price) <= 0) {
      throw new Error('Price must be greater than zero.');
    }
    if (Number(form.stock) < 0) {
      throw new Error('Stock cannot be negative.');
    }
  };

  const refreshProducts = async () => {
    const nextProducts = await getVendorProducts(user.email);
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
      imageUrls: product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : []),
      imagePublicId: product.imagePublicId,
      imagePublicIds: product.imagePublicIds ?? (product.imagePublicId ? [product.imagePublicId] : []),
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
    const secureUrl = info.secure_url;
    const publicId = info.public_id;

    setForm((current) => ({
      ...current,
      imageUrl: current.imageUrl || secureUrl,
      imageUrls: Array.from(new Set([...current.imageUrls, secureUrl])),
      imagePublicId: current.imagePublicId || publicId,
      imagePublicIds: Array.from(new Set([...current.imagePublicIds, publicId])),
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <VendorProductsHeader />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProductFormCard
            form={form}
            loading={loading}
            onFieldChange={updateForm}
            onStatusChange={(value) => setForm((current) => ({ ...current, status: value }))}
            onUploadSuccess={handleUploadSuccess}
            onSubmit={handleSubmit}
            onClear={resetForm}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
        </Grid>
      </Grid>

      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification((current) => ({ ...current, open: false }))}>
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}
