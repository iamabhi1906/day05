import type { Metadata } from 'next';
import './globals.css';
import { lato } from './ui/fonts';
import styles from '@/app/_css/layout.module.css';
import { Box } from '@mui/material';
import Providers from './providers';
import NavigationBar from '@/components/navigation-bar';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'StyleStreet',
  description: 'New e-commerce platform',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en" className={`${lato.className} ${styles.mainBody}`}>
      <body>
        <Providers session={session}>
          <NavigationBar />
          <Box className={styles.body}>{children}</Box>
        </Providers>
      </body>
    </html>
  );
}
