'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import GoogleIcon from '@mui/icons-material/Google';
import { Alert, Box, Button, Divider, Snackbar, Stack, Typography } from '@mui/material';
import styles from './login.module.css';
import { EmailLogin } from './login';
import { GoogleLogin } from '../auth-session';
import Link from 'next/link';
import { LoginSchema, LoginFormData } from '@/lib/schemas/auth.schema';
import InputField from '@/components/input-filed';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { setUserData } from '@/features/user/user.slice';
import { UserData, UserSchema } from '@/features/user/user.types';

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
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: NotificationSeverity.SUCCESS,
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
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
      const user = await GoogleLogin();
      showNotification('Login success..!!', NotificationSeverity.SUCCESS);
      dispatch(setUserData(UserSchema.parse(user)));
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error(error);
      showNotification(getErrorMessage(error, 'Login failed'), NotificationSeverity.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const user = await EmailLogin(data.email, data.password);
      if (!user) return;
      dispatch(setUserData(user));
      showNotification('Login success..!!', NotificationSeverity.SUCCESS);
      router.push('/dashboard');
    } catch (error: unknown) {
      console.log(error);
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

          <form onSubmit={handleSubmit(handleEmailLogin)}>
            <Stack spacing={2}>
              <InputField name="email" control={control} label="Email address" type="email" />
              <InputField name="password" control={control} label="Password" type="password" />
            </Stack>

            <Button variant="contained" fullWidth type="submit" disabled={loading || !isValid} sx={{ mt: 3 }}>
              {loading ? 'Signing in...' : 'Login with Email'}
            </Button>
          </form>

          <Box className={styles.signupLink}>
            <Typography variant="body2">
              Don&apos;t have an account?{' '}
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
