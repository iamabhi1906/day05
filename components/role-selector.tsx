'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { UserData, updateUserByEmail } from '@/lib/crud/user';
import styles from './css/role-selector.module.css';
import { Box } from '@mui/material';
import MainLogo from './main-logo';

const roleCards = [
  {
    key: 'user' as const,
    title: 'Continue as a Buyer',
    subtitle: 'Shop the latest styles and track orders effortlessly.',
    accent: 'Shop with ease',
    features: ['Discover curated products', 'Save favorites', 'Fast checkout'],
    icon: (
      <svg viewBox="0 0 64 64" className={styles.roleIcon} aria-hidden="true">
        <rect x="12" y="16" width="40" height="32" rx="8" />
        <path d="M24 28h16" />
        <path d="M24 36h10" />
      </svg>
    ),
  },
  {
    key: 'vendor' as const,
    title: 'Start selling as a Vendor',
    subtitle: 'Manage your catalog and grow your store in one place.',
    accent: 'Grow your brand',
    features: ['List products quickly', 'Manage inventory', 'See incoming orders'],
    icon: (
      <svg viewBox="0 0 64 64" className={styles.roleIcon} aria-hidden="true">
        <rect x="14" y="16" width="36" height="32" rx="8" />
        <path d="M22 24h20" />
        <path d="M22 32h12" />
        <path d="M22 40h8" />
        <circle cx="46" cy="40" r="6" />
      </svg>
    ),
  },
];

enum RoleOptions {
  BUYER = 'user',
  VENDOR = 'vendor',
}

export default function UserRoleSelect({ user }: { user: UserData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [open, setOpen] = useState(false);

  const displayName = user.name || user.email || 'Guest';

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectRole = async (role: RoleOptions) => {
    if (!user.email) {
      setMessage('Unable to update role without user email.');
      setMessageType('error');
      setOpen(true);
      return;
    }

    setLoading(true);
    const updated = await updateUserByEmail(user.email, { role });
    setLoading(false);

    if (updated) {
      setMessage('Role updated successfully.');
      setMessageType('success');
      setOpen(true);
      router.refresh();
      return;
    }

    setMessage('Unable to update your role. Please try again.');
    setMessageType('error');
    setOpen(true);
  };

  return (
    <Box className={styles.pageWrapper}>
      <Card className={styles.roleCard}>
        <CardContent className={styles.cardContent}>
          <Stack spacing={3}>
            <Box className={styles.heroSection}>
              <Box className={styles.heroIconWrap}>
                <MainLogo width={100}/>
              </Box>
              <Typography variant="h5" className={styles.heading}>
                Welcome to StyleStreet
              </Typography>
              <Typography variant="body2" className={styles.subtext}>
                {`Hello ${displayName}, choose how you want to experience the store.`}
              </Typography>
            </Box>

            <Box className={styles.userInfo}>
              <Typography variant="body2" className={styles.userLabel}>
                Signed in as
              </Typography>
              <Typography variant="body1" className={styles.userValue}>
                {user.email || 'Not available'}
              </Typography>
            </Box>

            <Stack spacing={2} className={styles.buttonGroup} direction={'row'}>
              {roleCards.map((option) => (
                <Button
                  key={option.key}
                  className={styles.roleButton}
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  onClick={() => handleSelectRole(option.key === 'user' ? RoleOptions.BUYER : RoleOptions.VENDOR)}
                >
                  <Box className={styles.optionContent}>
                    <Box className={styles.optionIconWrap}>{option.icon}</Box>
                    <Box className={styles.optionText}>
                      <Typography variant="subtitle1" className={styles.optionTitle}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" className={styles.optionSubtitle}>
                        {option.subtitle}
                      </Typography>
                      <Box className={styles.featureRow}>
                        {option.features.map((feature) => (
                          <Typography key={feature} variant="caption" className={styles.featureChip}>
                            {feature}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Button>
              ))}
            </Stack>

            <Box className={styles.pointsBox}>
              <Typography variant="subtitle2" className={styles.pointsTitle}>
                Why this works well
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" className={styles.pointItem}>
                  • Personalised experience for shoppers and vendors
                </Typography>
                <Typography variant="body2" className={styles.pointItem}>
                  • Clear setup with a polished, guided flow
                </Typography>
                <Typography variant="body2" className={styles.pointItem}>
                  • Smooth transition into your dashboard after selection
                </Typography>
              </Stack>
            </Box>

            <Typography variant="caption" className={styles.noteText}>
              Once selected, your account will be updated and you will continue to the app.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={messageType} className={styles.alert}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
