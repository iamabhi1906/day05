import { Review } from '@/features/review/review.types';
import { Avatar, Box, Card, CardContent, CardMedia, Rating, Stack, Typography } from '@mui/material';

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
      
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar>{review.reviewerName.charAt(0).toUpperCase()}</Avatar>

            <Box>
              <Typography sx={{ fontWeight: 700 }}>{review.reviewerName}</Typography>

              <Typography variant="body2" color="text.secondary">
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Rating value={review.rating} readOnly precision={0.5} />
          </Stack>
          {review.comment && <Typography color="text.secondary">{review.comment}</Typography>}
          {review.media?.length > 0 && (
            <CardMedia
              component="img"
              image={review.media[0]}
              alt="Review Image"
              sx={{
                width: 180,
                height: 180,
                objectFit: 'cover',
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
              }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
