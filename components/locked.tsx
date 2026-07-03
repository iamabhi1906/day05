'use client';
import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import styles from './css/LockedOutPage.module.css';
import Link from 'next/link';

export default function LockedOutPage() {
  return (
    <Box className={styles.root}>
      <Container maxWidth="sm">
        <Card elevation={8} className={styles.card}>
          <CardContent>
            <Stack spacing={3}>
              <Box className={styles.iconWrapper}>
                <BlockRoundedIcon className={styles.icon} />
              </Box>

              <Typography variant="h4">Access Blocked</Typography>

              <Typography variant="body1" color="secondary">
                Your account has been temporarily blocked from accessing this application.
              </Typography>

              <Typography variant="body2" color="text.secondary">
                If you believe this is a mistake, please contact the system administrator or support team for assistance.
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="error" LinkComponent={Link} href="/">
                  GO HOME
                </Button>

                <Button variant="outlined" LinkComponent={Link} href="mailto:support@example.com">
                  Contact Support
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
