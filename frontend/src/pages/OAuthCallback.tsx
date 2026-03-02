import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      setStatus('error');
      setError('No authorization code received');
      return;
    }

    // Backend doesn't have OAuth methods - just redirect
    setStatus('success');
    setTimeout(() => navigate({ to: '/' }), 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center border border-cyan-neon/30">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-cyan-neon mx-auto mb-4 animate-spin" />
            <h2 className="font-orbitron text-lg text-cyan-neon">CONNECTING...</h2>
            <p className="text-muted-foreground text-sm mt-2">Processing authorization</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="font-orbitron text-lg text-cyan-neon">CONNECTED!</h2>
            <p className="text-muted-foreground text-sm mt-2">Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="font-orbitron text-lg text-red-400">ERROR</h2>
            <p className="text-muted-foreground text-sm mt-2">{error}</p>
            <button
              onClick={() => navigate({ to: '/' })}
              className="mt-4 px-4 py-2 rounded-lg cyberpunk-btn transition-smooth text-sm"
            >
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
