import type { Metadata } from 'next';
import './globals.css';
import { inter, lato } from './ui/fonts';
import styles from '@/app/_css/layout.module.css';
import { Box } from '@mui/material';
import Providers from './providers';
import NavigationBar from '@/components/navigation-bar';
import { serverApi } from '@/lib/api/server.api';
import { UserData } from '@/features/user/user.types';

export const metadata: Metadata = {
  title: 'StyleStreet',
  description: 'New e-commerce platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: UserData | null = null;
  try {
    const api = await serverApi();
    const { data: userResponse } = await api.get('/auth/me');
    user = userResponse;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
  return (
    <html lang="en" className={`${lato.className} ${inter.className} ${styles.mainBody}`}>
      <body>
        <Providers user={user}>
          <NavigationBar />
          <Box className={styles.body}>{children}</Box>
        </Providers>
      </body>
    </html>
  );
}
