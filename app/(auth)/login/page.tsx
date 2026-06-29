'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';
import { Alert, Box, Button, Card, CardContent, Divider, Snackbar, Stack, TextField, Typography } from '@mui/material';
import styles from './login.module.css';
import { EmailLogin } from './login';
import { GoogleLogin } from '../auth-session';
import Link from 'next/link';

enum NotificationSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
}

type NotificationState = {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
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
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error(error);
      showNotification(getErrorMessage(error, 'Login failed'), NotificationSeverity.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      await EmailLogin(email, password);
      showNotification('Login success..!!', NotificationSeverity.SUCCESS);
      router.push('/dashboard');
    } catch (error: unknown) {
      showNotification(getErrorMessage(error, 'Login Failed'), NotificationSeverity.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box className={styles.pageWrapper}>
        <Stack spacing={3}>
          <Box className={styles.header}>
            <Typography variant="h5" className={styles.title}>
              Sign in to Your Account
            </Typography>
            <Typography variant="body2" className={styles.subtitle}>
              Access your dashboard, manage orders and continue where you left off.
            </Typography>
          </Box>

          <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth onClick={handleGoogleLogin} disabled={loading}>
            {loading ? 'Processing...' : 'Continue with Google'}
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

          <Box className={styles.signupLink}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="/signup" className={styles.link}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Box>

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
    </>
  );
}
