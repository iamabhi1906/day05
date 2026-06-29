'use client';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SaveIcon from '@mui/icons-material/Save';
import { Button, Card, CardContent, CardMedia, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import type { ProductStatus } from '@/lib/crud/product';
import type { ProductFormState } from '../types';
import { productCategories } from '../types';

type ProductFormCardProps = {
  form: ProductFormState;
  loading: boolean;
  onFieldChange: (field: keyof ProductFormState, value: string) => void;
  onStatusChange: (value: ProductStatus) => void;
  onUploadSuccess: (result: CloudinaryUploadWidgetResults) => void;
  onSubmit: () => void;
  onClear: () => void;
};

export function ProductFormCard({ form, loading, onFieldChange, onStatusChange, onUploadSuccess, onSubmit, onClear }: ProductFormCardProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">{form.id ? 'Edit product' : 'Add product'}</Typography>
          <TextField label="Name" value={form.name} onChange={(event) => onFieldChange('name', event.target.value)} fullWidth />
          <TextField
            label="Description"
            value={form.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={form.category}
              onChange={(event) => onFieldChange('category', event.target.value)}
            >
              {productCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Price" type="number" value={form.price} onChange={(event) => onFieldChange('price', event.target.value)} fullWidth />
            <TextField label="Stock" type="number" value={form.stock} onChange={(event) => onFieldChange('stock', event.target.value)} fullWidth />
          </Stack>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={form.status} onChange={(event) => onStatusChange(event.target.value as ProductStatus)}>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>

          {form.imageUrls.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2">Uploaded images</Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                {form.imageUrls.map((imageUrl) => (
                  <CardMedia
                    key={imageUrl}
                    component="img"
                    image={imageUrl}
                    alt={form.name || 'Product image'}
                    sx={{ width: 100, height: 100, borderRadius: 1, objectFit: 'cover' }}
                  />
                ))}
              </Stack>
            </Stack>
          ) : null}

          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{ multiple: true, folder: 'stylestreet' }}
            onSuccess={onUploadSuccess}
          >
            {({ open, isLoading }) => (
              <Button variant="outlined" startIcon={<AddPhotoAlternateIcon />} disabled={isLoading || loading} onClick={() => open()}>
                Upload images
              </Button>
            )}
          </CldUploadWidget>

          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<SaveIcon />} disabled={loading} onClick={onSubmit}>
              {form.id ? 'Update' : 'Save'}
            </Button>
            <Button variant="outlined" disabled={loading} onClick={onClear}>
              Clear
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
