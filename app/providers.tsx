'use client';

import { Provider, useDispatch } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SnackbarProvider } from 'notistack';
import store, { AppDispatch } from './store';
import ThemeProviderComp from './theme';
import { getUserByEmail } from '@/lib/crud/user';
import { setUserData } from '@/features/user/user.slice';
import { useEffect } from 'react';

function SessionUserSync({ session, children }: { children: React.ReactNode; session: { email?: string } | null }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initUser = async () => {
      const email = session?.email;
      if (!email) return;

      const user = await getUserByEmail(email);
      if (!user) return;

      dispatch(setUserData(user));
    };

    initUser();
  }, [dispatch, session?.email]);

  return <>{children}</>;
}

export default function Providers({ children, session }: { children: React.ReactNode; session: { email?: string } | null }) {
  return (
    <Provider store={store}>
      <AppRouterCacheProvider>
        <ThemeProviderComp>
          <SnackbarProvider autoHideDuration={5000} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} />
          <SessionUserSync session={session}>{children}</SessionUserSync>
        </ThemeProviderComp>
      </AppRouterCacheProvider>
    </Provider>
  );
}
