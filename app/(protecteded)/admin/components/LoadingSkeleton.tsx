import { Grid, Card, CardContent, Skeleton, Stack } from '@mui/material';

export default function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="rectangular" width="100%" height={80} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
