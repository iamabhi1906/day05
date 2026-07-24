'use client';

import { Provider, useDispatch } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SnackbarProvider } from 'notistack';
import store, { AppDispatch } from './store';
import ThemeProviderComp from './theme';
import { setUserData } from '@/features/user/user.slice';
import { useEffect } from 'react';
import { getUserCartItemsAsync } from '@/features/cart/cart.actions';
import { UserData } from '@/features/user/user.types';

function SessionUserSync({ user, children }: { children: React.ReactNode; user: UserData | null }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initUser = async () => {
      if (user) {
        dispatch(setUserData(user));
        dispatch(getUserCartItemsAsync({ buyerEmail: user.email }));
      } else {
        dispatch(getUserCartItemsAsync({ buyerEmail: null }));
      }
    };

    initUser();
  }, [dispatch, user]);

  return <>{children}</>;
}

export default function Providers({ children, user }: { children: React.ReactNode; user: UserData | null }) {
  return (
    <Provider store={store}>
      <AppRouterCacheProvider>
        <ThemeProviderComp>
          <SnackbarProvider autoHideDuration={5000} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} />
          <SessionUserSync user={user}>{children}</SessionUserSync>
        </ThemeProviderComp>
      </AppRouterCacheProvider>
    </Provider>
  );
}
