'use client';

import { Provider, useDispatch } from 'react-redux';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { SnackbarProvider } from 'notistack';
import store, { AppDispatch } from './store';
import ThemeProviderComp from './theme';
import { getUserByEmail } from '@/lib/crud/user';
import { setUserData } from '@/features/user/user.slice';
import { useEffect } from 'react';
import { getUserCartItemsAsync } from '@/features/cart/cart.actions';

function SessionUserSync({ session, children }: { children: React.ReactNode; session: { email?: string } | null }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initUser = async () => {
      const email = session?.email;
      if (email) {
        const user = await getUserByEmail(email);
        if (user) {
          dispatch(setUserData(user));
        }
        dispatch(getUserCartItemsAsync({ buyerEmail: email }));
      } else {
        dispatch(getUserCartItemsAsync({ buyerEmail: null }));
      }
    };

    initUser();
  }, [dispatch, session?.email]);

  return <>{children}</>;
}

export default function Providers({ children, session }: { children: React.ReactNode; session: { email?: string } | null }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;
    try {
      const perf: any = window.performance;
      const orig = perf.measure.bind(perf);
      perf.measure = function (name: any, startOrOptions?: any, end?: any) {
        try {
          if (startOrOptions && typeof startOrOptions === 'object') {
            const options = { ...startOrOptions };
            if (typeof options.start === 'number' && options.start < 0) options.start = 0;
            if (typeof options.end === 'number' && options.end < 0) options.end = 0;
            return orig(name, options);
          }
          return orig(name, startOrOptions, end);
        } catch (e) {
          return orig(name, startOrOptions, end);
        }
      };
      return () => {
        perf.measure = orig;
      };
    } catch (e) {
      // ignore
    }
  }, []);
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
