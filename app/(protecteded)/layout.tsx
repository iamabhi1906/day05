import LockedOutPage from '@/components/locked';
import UserRoleSelect from '@/components/role-selector';
import { serverApi } from '@/lib/api/server.api';
import { Box } from '@mui/material';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const api = await serverApi();
  const { data: user } = await api.get('/auth/me');
  if (!user) redirect('/login');
  if (user.role == null) return <UserRoleSelect user={user} />;
  if (user.isBlocked) return <LockedOutPage />;
  return <Box sx={{ height: '100%', pt: 10 }}>{children}</Box>;
}
