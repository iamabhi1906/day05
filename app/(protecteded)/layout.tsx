import UserRoleSelect from '@/components/role-selector';
import NavigationBar from '@/components/navigation-bar';
import { getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/crud/user';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const email = session?.email;
  if (!email) redirect('/login');
  const user = await getUserByEmail(email!);
  if (!user) redirect('/login');
  if (user.role == null) return <UserRoleSelect user={user} />;
  return (
    <>
      <NavigationBar user={user} />
      {children}
    </>
  );
}
