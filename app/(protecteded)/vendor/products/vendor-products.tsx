'use client';
import { useState } from 'react';
import { Alert, Box, Grid, Snackbar } from '@mui/material';
import { createProduct, deleteProduct, getVendorProducts, ProductData, ProductInput, updateProduct } from '@/lib/crud/product';
import { UserData } from '@/lib/crud/user';
import { ProductFormCard } from './components/product-form-card-new';
import { ProductTable } from './components/product-table';
import { VendorProductsHeader } from './components/vendor-products-header';
import { ProductFormData } from '@/lib/schemas/product.schema';
import { productCategories } from './types';

type NotificationState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

type EditingProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrls: string[];
  status: 'draft' | 'published';
};

const toProductInput = (formData: ProductFormData, editingId: string | null, user: UserData): ProductInput => ({
  name: formData.name.trim(),
  description: formData.description.trim(),
  price: formData.price,
  stock: formData.stock,
  category: formData.category.trim(),
  imageUrl: formData.imageUrls[0] || '',
  imageUrls: formData.imageUrls,
  imagePublicId: '', // Will be handled by Cloudinary
  imagePublicIds: [], // Will be handled by Cloudinary
  status: formData.status,
  vendorEmail: user.email,
  vendorName: user.name || user.email,
});

export default function VendorProducts({ initialProducts, user }: { initialProducts: ProductData[]; user: UserData }) {
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = (message: string, severity: NotificationState['severity']) => {
    setNotification({ open: true, message, severity });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setImageUrls([]);
  };

  const refreshProducts = async () => {
    const nextProducts = await getVendorProducts(user.email);
    setProducts(nextProducts);
  };

  const handleFormSubmit = async (formData: ProductFormData) => {
    try {
      setLoading(true);
      const payload = toProductInput(formData, editingProduct?.id || null, user);

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
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
    setEditingProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrls: product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : []),
      status: product.status,
    });
    setImageUrls(product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : []));
  };

  const handleDelete = async (productId: string) => {
    try {
      setLoading(true);
      await deleteProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
      showNotification('Product deleted.', 'success');
      if (editingProduct?.id === productId) resetForm();
    } catch {
      showNotification('Unable to delete product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (imageUrl: string) => {
    setImageUrls((current) => [...new Set([...current, imageUrl])]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <VendorProductsHeader />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProductFormCard
            initialData={
              editingProduct
                ? {
                    id: editingProduct.id,
                    name: editingProduct.name,
                    description: editingProduct.description,
                    price: editingProduct.price,
                    stock: editingProduct.stock,
                    category: editingProduct.category,
                    imageUrls: imageUrls,
                    status: editingProduct.status,
                  }
                : undefined
            }
            loading={loading}
            categories={productCategories}
            onUploadSuccess={handleUploadSuccess}
            onSubmit={handleFormSubmit}
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
