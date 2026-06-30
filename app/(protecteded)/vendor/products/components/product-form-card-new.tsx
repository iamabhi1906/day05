'use client';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import type { ProductStatus } from '@/lib/crud/product';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema, ProductFormData } from '@/lib/schemas/product.schema';
import { RHFTextField, RHFSelect, SelectOption } from '@/components/form-components';

type ProductFormCardProps = {
  initialData?: {
    id: string | null;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrls: string[];
    status: ProductStatus;
  };
  loading: boolean;
  categories: string[];
  onUploadStart?: () => void;
  onUploadSuccess: (imageUrl: string, publicId: string) => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClear: () => void;
};

export function ProductFormCard({ initialData, loading, categories, onUploadStart, onUploadSuccess, onSubmit, onClear }: ProductFormCardProps) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isValid, errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    mode: 'onChange',
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          stock: initialData.stock,
          category: initialData.category,
          status: initialData.status,
          imageUrls: initialData.imageUrls,
        }
      : {
          imageUrls: [],
          status: 'draft',
        },
  });

  const imageUrls = watch('imageUrls');

  const categoryOptions: SelectOption[] = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const statusOptions: SelectOption[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ];

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as { secure_url?: string; public_id?: string };
    if (!info.secure_url || !info.public_id) return;

    onUploadSuccess(info.secure_url, info.public_id);
  };

  const handleClear = () => {
    reset();
    onClear();
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{initialData?.id ? 'Edit product' : 'Add product'}</Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <RHFTextField name="name" control={control} label="Product Name" placeholder="Enter product name" />

              <RHFTextField
                name="description"
                control={control}
                label="Description"
                placeholder="Enter product description"
                multiline
                minRows={3}
                maxRows={5}
              />

              <RHFSelect name="category" control={control} label="Category" options={categoryOptions} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="price" control={control} label="Price" type="number" placeholder="0.00" />
                <RHFTextField name="stock" control={control} label="Stock" type="number" placeholder="0" />
              </Stack>

              <RHFSelect name="status" control={control} label="Status" options={statusOptions} />

              {imageUrls && imageUrls.length > 0 ? (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Uploaded images</Typography>
                  <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                    {imageUrls.map((imageUrl) => (
                      <CardMedia
                        key={imageUrl}
                        component="img"
                        image={imageUrl}
                        alt="Product image"
                        sx={{ width: 100, height: 100, borderRadius: 1, objectFit: 'cover' }}
                      />
                    ))}
                  </Stack>
                </Stack>
              ) : null}

              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                options={{ multiple: true, folder: 'stylestreet' }}
                onSuccess={handleUploadSuccess}
              >
                {({ open, isLoading }) => (
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    disabled={isLoading || loading}
                    onClick={() => {
                      onUploadStart?.();
                      open();
                    }}
                  >
                    Upload images
                  </Button>
                )}
              </CldUploadWidget>

              <Stack direction="row" spacing={1}>
                <Button variant="contained" startIcon={<SaveIcon />} disabled={loading || !isValid} type="submit">
                  {initialData?.id ? 'Update' : 'Save'}
                </Button>
                <Button variant="outlined" disabled={loading} onClick={handleClear}>
                  Clear
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </CardContent>
    </Card>
  );
}
