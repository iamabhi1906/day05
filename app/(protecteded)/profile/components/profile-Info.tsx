'use client';
import { updateUserByEmail, UserData } from '@/lib/crud/user';
import { Avatar, Box, Typography, Button, Divider, Stack, Container } from '@mui/material';
import styles from './profile-info.module.css';
import Image from 'next/image';
import { useState } from 'react';
import { OrderData } from '@/lib/crud/order';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { People } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface Props {
  user: UserData;
  orders: OrderData[];
}

export default function ProfileCard({ user, orders }: Props) {
  const [profile, setProfile] = useState<UserData>(user);
  const router = useRouter();

  const handleUploadSuccess = async (result: CloudinaryUploadWidgetResults) => {
    const info = result.info as { secure_url?: string; public_id?: string };
    if (!info.secure_url || !info.public_id) return;
    const tempProfile = await updateUserByEmail(profile.email, { avatar: info.secure_url });
    if (!tempProfile) return;
    setProfile(tempProfile);
    router.refresh();
  };
  return (
    <Container className={styles.card}>
      {profile.avatar ? (
        <Image src={profile.avatar} height={1000} width={1000} alt="user_image" loading="eager" className={styles.avatar} />
      ) : (
        <Avatar className={styles.avatar} sx={{ height: 200, width: 200 }}></Avatar>
      )}

      <Typography variant="h4">{profile.name}</Typography>

      <Typography variant="body2" color="text.secondary">
        {profile.role}
      </Typography>

      <Stack direction={'row'} spacing={6}>
        <Metric label="Orders" value={orders.length} />
        <Divider orientation="vertical" flexItem />
        <Metric label="Followers" value={238} />
        <Divider orientation="vertical" flexItem />
        <Metric label="Following" value={101} />
      </Stack>
      <Box>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{ multiple: false, folder: 'stylestreet' }}
          onSuccess={handleUploadSuccess}
        >
          {({ open }) => (
            <Button
              variant="outlined"
              onClick={() => {
                open();
              }}
            >
              Change your avatar
            </Button>
          )}
        </CldUploadWidget>
      </Box>
    </Container>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Box className={styles.metric}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
