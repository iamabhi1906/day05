'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';
import { Alert, Box, Button, Card, CardContent, Divider, Snackbar, Stack, TextField, Typography } from '@mui/material';
import styles from './login.module.css';
import { EmailLogin } from './login';
import { GoogleLogin } from '../auth-session';

enum NotificationSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
}

type NotificationState = {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: NotificationSeverity.SUCCESS,
  });

  const showNotification = (message: string, severity: NotificationSeverity) => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleLogin();
      showNotification('Login success..!!', NotificationSeverity.SUCCESS);
      // TODO: Uncomment to redirect
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      showNotification(error?.message || 'Login failed', NotificationSeverity.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      EmailLogin(email, password);
      showNotification('Login success..!!', NotificationSeverity.SUCCESS);
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      showNotification(error?.message || 'Login Failed', NotificationSeverity.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent>
          <Stack spacing={3}>
            <Box className={styles.header}>
              <Typography variant="h5" className={styles.title}>
                Sign in to Your Account
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              fullWidth
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? 'Processing...!!' : 'Continue with Google'}
            </Button>

            <Box className={styles.dividerWrapper}>
              <Divider className={styles.divider} />
              <Typography variant="caption" color="textSecondary">
                OR
              </Typography>
              <Divider className={styles.divider} />
            </Box>

            <Stack spacing={2}>
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                disabled={loading}
                autoComplete="email"
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                disabled={loading}
                autoComplete="current-password"
              />
            </Stack>

            <Button variant="contained" fullWidth onClick={handleEmailLogin} disabled={loading}>
              {loading ? 'Signing in...' : 'Login with Email'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
