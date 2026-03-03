import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, isFetching: actorFetching } = useActor();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const processedRef = useRef(false);

  useEffect(() => {
    if (actorFetching || !actor) return;
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        // Parse the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace('#', '?').slice(1));

        const code = urlParams.get('code') || hashParams.get('code');
        const error = urlParams.get('error') || hashParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        const redirectUri = `${window.location.origin}/oauth/callback`;

        // Store the OAuth credentials via backend
        await actor.storeGoogleOAuthCredentials(code, redirectUri);

        // Invalidate all connection-related queries to force a fresh fetch
        await queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] });
        await queryClient.invalidateQueries({ queryKey: ['googleOAuthCredentials'] });
        await queryClient.invalidateQueries({ queryKey: ['youtubeChannelConnection'] });
        await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });

        // Refetch to ensure updated state is loaded before navigating
        await queryClient.refetchQueries({ queryKey: ['youtubeChannel'] });

        setStatus('success');

        // Navigate home after a short delay so user sees success state
        setTimeout(() => {
          navigate({ to: '/' });
        }, 1500);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('[OAuthCallback] Error:', message);
        setErrorMessage(message);
        setStatus('error');

        setTimeout(() => {
          navigate({ to: '/' });
        }, 3000);
      }
    };

    handleCallback();
  }, [actor, actorFetching, navigate, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border shadow-lg max-w-sm w-full mx-4">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Connecting YouTube…</h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we complete the connection.
            </p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-success" />
            <h2 className="text-lg font-semibold text-foreground">YouTube Connected!</h2>
            <p className="text-sm text-muted-foreground text-center">
              Your YouTube channel has been connected successfully. Redirecting…
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">Connection Failed</h2>
            <p className="text-sm text-muted-foreground text-center">{errorMessage}</p>
            <p className="text-xs text-muted-foreground">Redirecting back…</p>
          </>
        )}
      </div>
    </div>
  );
}
