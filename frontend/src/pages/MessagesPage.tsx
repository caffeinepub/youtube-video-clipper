import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import UserMessages from '../components/UserMessages';
import { MessageSquare, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MessagesPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <MessageSquare size={64} className="text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground">Sign in to view messages</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Connect with Internet Identity to access your messages.
        </p>
        <Button
          onClick={() => login()}
          disabled={loginStatus === 'logging-in'}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <LogIn size={16} className="mr-2" />
          {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={24} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
      </div>
      <UserMessages />
    </div>
  );
}
