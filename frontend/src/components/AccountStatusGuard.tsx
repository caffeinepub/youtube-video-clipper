import { Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { UserStatus } from '../backend';
import AccountStatusErrorScreen from './AccountStatusErrorScreen';

interface AccountStatusGuardProps {
  children: React.ReactNode;
}

export default function AccountStatusGuard({ children }: AccountStatusGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  // Only check status for authenticated users
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading while fetching profile
  if (isLoading || !isFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check for banned or suspended status
  if (userProfile?.status === UserStatus.banned) {
    return <AccountStatusErrorScreen status={UserStatus.banned} />;
  }

  if (userProfile?.status === UserStatus.suspended) {
    return <AccountStatusErrorScreen status={UserStatus.suspended} />;
  }

  return <>{children}</>;
}
