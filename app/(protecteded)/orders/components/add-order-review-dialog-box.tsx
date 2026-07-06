'use client';

import { AppDispatch, RootState } from '@/app/store';
import { OrderData } from '@/features/orders/orders.types';
import { ReviewForm, ReviewFormInput, ReviewFormOutput, reviewInputSchema } from '@/features/review/review.types';
import { Protect } from '@/lib/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Rating, Stack, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CldUploadWidget } from 'next-cloudinary';
import { CloudinaryInfo } from '../../vendor/products/types';
import { Attachment, CloudUpload } from '@mui/icons-material';
import Image from 'next/image';
import { addReview } from '@/services/review/add-review';

interface AddOrderReviewProps {
  order: OrderData;
  open: boolean;
  onClose: () => void;
}

export default function AddOrderReview({ order, open, onClose }: AddOrderReviewProps) {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormInput, any, ReviewFormOutput>({
    resolver: zodResolver(reviewInputSchema),
    mode: 'onSubmit',
    defaultValues: {
      rating: 4,
      comment: '',
    },
  });

  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!userData?.email || !userData?.name) return;

    setValue('buyerEmail', userData.email);
    setValue('reviewerName', userData.name);
    setValue('productId', order.productId);
    setValue('orderId', order.orderId.toString());
  }, [userData, setValue, order]);

  const onSubmit = async (data: ReviewFormOutput) => {
    await addReview(data);

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Write a Review</DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Product
              </Typography>

              <Typography variant="h6">{order.productName}</Typography>
            </Box>

            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography gutterBottom>Rating</Typography>
                  <Rating
                    {...field}
                    precision={1}
                    value={Number(field.value) || 0}
                    onChange={(_, value) => field.onChange(value ?? 0)}
                    size="large"
                  />
                  {errors.rating && (
                    <Typography variant="caption" color="error">
                      {errors.rating.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Your Review"
                  multiline
                  rows={5}
                  fullWidth
                  error={!!errors.comment}
                  helperText={errors.comment?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="media"
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

                      const currentImages = getValues('media') || [];

                      setValue('media', [...currentImages, info.secure_url], {
                        shouldValidate: true,
                      });
                    }}
                  >
                    {({ open, isLoading }) => (
                      <Button onClick={() => open()} disabled={isLoading}>
                        <Stack direction={'row'} spacing={2}>
                          <Attachment />
                          <Typography>Attach a media</Typography>
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
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Submit Review
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
