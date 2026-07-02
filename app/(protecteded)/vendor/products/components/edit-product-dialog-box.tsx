import { categories } from '@/app/products/components/product-categories';
import InputField from '@/components/input-filed';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloudUpload } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { CldUploadWidget } from 'next-cloudinary';
import { Controller, useForm } from 'react-hook-form';
import { CloudinaryInfo } from '../types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ProductData, ProductEditInput, ProductEditOutput, ProductEditSchema } from '@/features/product/product.types';
import { updateProduct } from '@/lib/crud/product';
import { enqueueSnackbar } from 'notistack';

interface EditProductDialogBoxProps {
  open: boolean;
  onClose: () => void;
  productData: ProductData;
}

export default function EditProductDialogBox({ open, onClose, productData }: EditProductDialogBoxProps) {
  const { control, handleSubmit, setValue, getValues, reset } = useForm<ProductEditInput, any, ProductEditOutput>({
    resolver: zodResolver(ProductEditSchema),
    mode: 'onSubmit',
  });
  const [addProductLoading, setAddProductLoading] = useState<boolean>(false);

  useEffect(() => {
    reset({
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      stock: productData.stock,
      status: productData.status,
      imageUrls: productData.imageUrls,
    });
  }, [productData, reset]);

  const categoriesOptions = categories
    .filter(({ value }) => value !== null && value !== undefined)
    .map(({ label, value }) => ({
      label,
      value: String(value),
    }));

  const handleSubmitTemp = async (data: ProductEditOutput) => {
    try {
      setAddProductLoading(true);
      await updateProduct(productData.id, data);
      enqueueSnackbar('Product updated successfully.', { variant: 'success' });
      await onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      enqueueSnackbar('Failed to update product.', { variant: 'error' });
    } finally {
      setAddProductLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth={'md'}>
      <form onSubmit={handleSubmit(handleSubmitTemp)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent dividers={true}>
          <Stack spacing={2}>
            <InputField control={control} label="Enter product name" name="name" type="text" />
            <InputField control={control} label="Enter product description" name="description" />
            <InputField control={control} label="Select category" name="category" type="select" options={categoriesOptions} />
            <Stack direction={'row'} spacing={2}>
              <InputField control={control} label="Price of Product" name="price" type="number" />
              <InputField control={control} label="Enter stock quantity" name="stock" type="number" />
            </Stack>
            <InputField
              control={control}
              label="Set your Product Status"
              name="status"
              type="radio"
              options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
              ]}
            />

            <Controller
              control={control}
              name="imageUrls"
              render={({ field, fieldState }) => (
                <>
                  <Stack direction="row" spacing={1}>
                    {field.value?.map((url: string) => (
                      <Image key={url} src={url} alt="Product" width={120} height={120} />
                    ))}
                  </Stack>
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    options={{
                      multiple: true,
                      folder: 'stylestreet',
                    }}
                    onSuccess={(result) => {
                      const info = result.info as CloudinaryInfo;

                      if (!info.secure_url) return;

                      const currentImages = getValues('imageUrls') || [];

                      setValue('imageUrls', [...currentImages, info.secure_url], {
                        shouldValidate: true,
                      });
                    }}
                  >
                    {({ open, isLoading }) => (
                      <Button onClick={() => open()} disabled={isLoading || addProductLoading}>
                        <Stack direction={'row'} spacing={2}>
                          <CloudUpload />
                          <Typography>Upload Images</Typography>
                        </Stack>
                      </Button>
                    )}
                  </CldUploadWidget>

                  {fieldState.error && (
                    <Typography color="error" variant="body2">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={addProductLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={addProductLoading}>
            {addProductLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
