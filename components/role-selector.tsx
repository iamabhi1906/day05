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
import styles from './role-selector.module.css';
import { Box } from '@mui/material';

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
            <Box className={styles.headerSection}>
              <Typography variant="h5" className={styles.heading}>
                Choose your role
              </Typography>
              <Typography variant="body2" className={styles.subtext}>
                {`Hello ${displayName}, select Buyer or Vendor to continue.`}
              </Typography>
            </Box>

            <div className={styles.userInfo}>
              <Typography variant="body2" className={styles.userLabel}>
                Email
              </Typography>
              <Typography variant="body1" className={styles.userValue}>
                {user.email || 'Not available'}
              </Typography>
            </div>

            <Stack spacing={2} className={styles.buttonGroup}>
              <Button
                key={RoleOptions.BUYER}
                className={styles.roleButton}
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={() => handleSelectRole(RoleOptions.BUYER)}
              >
                {RoleOptions.BUYER}
              </Button>
              <Button
                key={RoleOptions.VENDOR}
                className={styles.roleButton}
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={() => handleSelectRole(RoleOptions.VENDOR)}
              >
                {RoleOptions.VENDOR}
              </Button>
            </Stack>

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
