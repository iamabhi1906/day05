'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@mui/icons-material/Google';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import styles from './signup.module.css';
import { EmailSignup } from './signup';

enum NotificationSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
}

type NotificationState = {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
};

type UserRole = 'user' | 'vendor';

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
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

  const handleEmailSignup = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      setLoading(true);
      await EmailSignup(email, password, role);
      showNotification('Signup success!', NotificationSeverity.SUCCESS);
      router.push('/dashboard');
    } catch (error: unknown) {
      showNotification(getErrorMessage(error, 'Failed to signUp..!!'), NotificationSeverity.ERROR);
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
                Create Your Account
              </Typography>
              <Typography variant="body2" className={styles.subtitle}>
                Join us and start your journey today
              </Typography>
            </Box>

            <Box className={styles.roleSelection}>
              <Typography variant="subtitle2" className={styles.roleLabel}>
                Select Your Role
              </Typography>
              <RadioGroup
                row
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className={styles.radioGroup}
              >
                <FormControlLabel value="user" control={<Radio />} label="Buyer" disabled={loading} />
                <FormControlLabel value="vendor" control={<Radio />} label="Vendor" disabled={loading} />
              </RadioGroup>
            </Box>

            <Divider />

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
                autoComplete="new-password"
                helperText="At least 6 characters"
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                disabled={loading}
                autoComplete="new-password"
              />
            </Stack>

            <Button variant="contained" fullWidth onClick={handleEmailSignup} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box className={styles.dividerWrapper}>
              <Divider className={styles.divider} />
              <Typography variant="caption" color="textSecondary">
                OR
              </Typography>
              <Divider className={styles.divider} />
            </Box>

            <Button variant="outlined" startIcon={<GoogleIcon />} fullWidth disabled={loading}>
              {loading ? 'Processing...' : 'Continue with Google'}
            </Button>

            <Box className={styles.loginLink}>
              <Typography variant="body2">
                Already have an account?{' '}
                <a href="/login" className={styles.link}>
                  Sign in
                </a>
              </Typography>
            </Box>
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
