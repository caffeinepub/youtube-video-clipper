import React from 'react';
import { MessageSquare, LogIn } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import UserMessages from '../components/UserMessages';

export default function MessagesPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <MessageSquare className="w-12 h-12 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-semibold text-white">Sign in to view messages</h2>
        <p className="text-muted-foreground text-sm text-center">
          You need to be logged in to access your messages.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === 'logging-in'}
          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
        >
          <LogIn className="w-4 h-4" />
          {loginStatus === 'logging-in' ? 'Logging in…' : 'Login'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl font-display">My Messages</h1>
          <p className="text-muted-foreground text-sm">Messages from admins and replies</p>
        </div>
      </div>
      <UserMessages />
    </div>
  );
}
