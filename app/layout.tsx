import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import './globals.css';
import { lato } from './ui/fonts';
import styles from '@/app/_css/layout.module.css';
import ThemeProviderComp from './theme';
import { Box } from '@mui/material';

export const metadata: Metadata = {
  title: 'StyleStreet',
  description: 'New e-commerce platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.className} ${styles.mainBody}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProviderComp>
            <Box className={styles.body}>{children}</Box>
          </ThemeProviderComp>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
