'use client';
import { useState } from 'react';
import { Box } from '@mui/material';
import { UserData } from '@/lib/crud/user';
import { ProductTable } from './components/product-table';
import { VendorProductsHeader } from './components/vendor-products-header';
import AddProductDialogBox from './components/add-product-dialog-box';
import EditProductDialogBox from './components/edit-product-dialog-box';
import { ProductData } from '@/features/product/product.types';
import { deleteProduct, getVendorProducts } from '@/lib/crud/product';
import { enqueueSnackbar } from 'notistack';

export default function VendorProducts({ initialProducts, user }: { initialProducts: ProductData[]; user: UserData }) {
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

  const handleEdit = (product: ProductData) => {
    setEditingProduct(product);
  };

  const handleClose = async () => {
    try {
      setIsAddDialogOpen(false);
      setEditingProduct(null);
      const refreshProduct = await getVendorProducts(user.email);
      setProducts(refreshProduct);
    } catch (error) {
      console.log('Error refreshing the products..!!');
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
      enqueueSnackbar('Product deleted successfully.', { variant: 'success' });
    } catch (error) {
      console.error('Failed to delete product:', error);
      enqueueSnackbar('Failed to delete product.', { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <VendorProductsHeader onAddProduct={() => setIsAddDialogOpen(true)} />
      <AddProductDialogBox open={isAddDialogOpen} userData={user} onClose={handleClose} />
      {editingProduct ? <EditProductDialogBox open={Boolean(editingProduct)} productData={editingProduct} onClose={handleClose} /> : null}
      <Box>
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>
    </Box>
  );
}
