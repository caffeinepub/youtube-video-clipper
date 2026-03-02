import React from 'react';
import { ShieldX, Ban } from 'lucide-react';
import type { UserStatus } from '../types/app';

interface AccountStatusErrorScreenProps {
  status: UserStatus;
  onLogout: () => void;
}

export default function AccountStatusErrorScreen({ status, onLogout }: AccountStatusErrorScreenProps) {
  const isBanned = status === 'banned';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0d0020' }}>
      <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center border border-red-500/30">
        {isBanned ? (
          <Ban className="w-16 h-16 text-red-500 mx-auto mb-4" />
        ) : (
          <ShieldX className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        )}
        <h1 className="font-orbitron text-xl text-foreground mb-2">
          {isBanned ? 'Account Banned' : 'Account Suspended'}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          {isBanned
            ? 'Your account has been permanently banned for violating our terms of service.'
            : 'Your account has been temporarily suspended. Please contact support.'}
        </p>
        <button
          onClick={onLogout}
          className="px-6 py-2 rounded-lg cyberpunk-btn transition-smooth text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
