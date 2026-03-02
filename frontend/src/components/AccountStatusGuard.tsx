import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import AccountStatusErrorScreen from './AccountStatusErrorScreen';
import type { UserStatus } from '../types/app';

interface AccountStatusGuardProps {
  children: React.ReactNode;
}

export default function AccountStatusGuard({ children }: AccountStatusGuardProps) {
  // Since backend doesn't have user status management, always allow access
  return <>{children}</>;
}
