'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import GoogleIcon from '@mui/icons-material/Google';
import { Alert, Box, Button, Divider, Snackbar, Stack, Typography } from '@mui/material';
import styles from './signup.module.css';
import { EmailSignup } from './signup';
import Link from 'next/link';
import { SignupSchema, SignupFormData } from '@/lib/schemas/auth.schema';
import { GoogleLogin } from '../auth-session';
import InputField from '@/components/input-filed';

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

const defaultValues: SignupFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
};

export default function SignupPage() {
  const router = useRouter();
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
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const showNotification = (message: string, severity: NotificationSeverity) => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleEmailSignup = async (data: SignupFormData) => {
    try {
      setLoading(true);
      await EmailSignup(data.name, data.email, data.password, data.role);
      showNotification('Signup success!', NotificationSeverity.SUCCESS);
      router.push('/dashboard');
    } catch (error: unknown) {
      showNotification(getErrorMessage(error, 'Failed to signUp..!!'), NotificationSeverity.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleLogin();
      showNotification('SignUp success..!!', NotificationSeverity.SUCCESS);
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error(error);
      showNotification(getErrorMessage(error, 'Login failed'), NotificationSeverity.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box className={styles.pageWrapper}>
        <Box>
          <Stack spacing={3}>
            <Box className={styles.header}>
              <Typography variant="h5" className={styles.title}>
                Create Your Account
              </Typography>
              <Typography variant="body2" className={styles.subtitle}>
                Start your vendor or buyer journey with a beautiful, modern dashboard.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(handleEmailSignup)}>
              <Box className={styles.roleSelection}>
                <Typography variant="subtitle2" className={styles.roleLabel}>
                  Select Your Role
                </Typography>
                <InputField
                  name="role"
                  label=''
                  control={control as any}
                  type="radio"
                  options={[
                    { value: 'user', label: 'Buyer' },
                    { value: 'vendor', label: 'Vendor' },
                  ]}
                />
              </Box>

              <Stack spacing={2}>
                <InputField name="name" control={control} label="Your name" type="text" placeholder="John Doe" />
                <InputField name="email" control={control} label="Email address" type="email" placeholder="you@example.com" />
                <InputField name="password" control={control} label="Password" type="password" />
                <InputField name="confirmPassword" control={control} label="Confirm Password" type="password" />
              </Stack>

              <Button variant="contained" fullWidth type="submit" disabled={loading || !isValid} sx={{ mt: 3 }}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>

            <Box className={styles.dividerWrapper}>
              <Divider className={styles.divider} />
              <Typography variant="caption" color="textSecondary">
                OR
              </Typography>
              <Divider className={styles.divider} />
            </Box>

            <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth disabled={loading} onClick={handleGoogleLogin}>
              {loading ? 'Processing...' : 'Continue with Google'}
            </Button>

            <Box className={styles.loginLink}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/login" className={styles.link}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Box>
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
