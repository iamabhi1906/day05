'use client';
import { Box, Grid, Skeleton, List, ListItem, Stack } from '@mui/material';

export default function ProductSkeleton() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', p: 3, pt: 10 }}>
      <Box
        sx={{
          width: 260,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          mr: 3,
        }}
      >
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rounded" width="100%" height={40} sx={{ mb: 3 }} />
        <List>
          {Array.from(new Array(14)).map((_, index) => (
            <ListItem key={index} disableGutters sx={{ py: 1.5 }}>
              <Skeleton variant="text" width={index % 2 === 0 ? '80%' : '60%'} height={24} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid container key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rounded" width="100%" height={200} sx={{ mb: 2, borderRadius: 2 }} />

              <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" width="60%" height={24} />
              </Stack>

              <Skeleton variant="text" width="30%" height={20} sx={{ mb: 2 }} />

              <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 'auto', borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
