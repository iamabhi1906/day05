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
import { ProductFormDataInput, ProductFormDataOutput, ProductInputSchema } from '@/features/product/product.types';
import { UserData } from '@/features/user/user.types';
import { createProduct } from '@/lib/crud/product';
import { enqueueSnackbar } from 'notistack';

interface AddProductDialogBoxProps {
  open: boolean;
  onClose: () => void;
  userData: UserData;
}

export default function AddProductDialogBox({ open, onClose, userData }: AddProductDialogBoxProps) {
  const { control, handleSubmit, setValue, getValues } = useForm<ProductFormDataInput, any, ProductFormDataOutput>({
    resolver: zodResolver(ProductInputSchema),
    mode: 'onSubmit',
  });
  const [addProductLoading, setAddProductLoading] = useState<boolean>(false);

  useEffect(() => {
    setValue('vendorName', userData.name);
    setValue('vendorEmail', userData.email);
  }, [setValue, userData.email, userData.name]);
  const categoriesOptions = categories
    .filter(({ value }) => value !== null && value !== undefined)
    .map(({ label, value }) => ({
      label,
      value: String(value),
    }));

  const handleSubmitTemp = async (data: ProductFormDataOutput) => {
    try {
      setAddProductLoading(true);
      await createProduct(data);
      enqueueSnackbar('Product created successfully.', { variant: 'success' });
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      enqueueSnackbar('Failed to create product.', { variant: 'error' });
    } finally {
      setAddProductLoading(false);
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth={'md'}>
      <form onSubmit={handleSubmit(handleSubmitTemp)}>
        <DialogTitle>Add Product</DialogTitle>
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
            {addProductLoading ? 'Saving...' : 'Add Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
