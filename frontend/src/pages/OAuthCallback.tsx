import { useEffect, useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStoreGoogleOAuth } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ACTOR_WAIT_TIMEOUT_MS = 20000; // 20 seconds
const ACTOR_POLL_INTERVAL_MS = 300;  // poll every 300ms

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();
  const { mutateAsync: storeOAuth } = useStoreGoogleOAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'waiting' | 'processing' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const hasProcessed = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Set a timeout: if actor never becomes available, show error
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (hasProcessed.current) return;
      if (pollRef.current) clearInterval(pollRef.current);
      hasProcessed.current = true;
      setStatus('error');
      setErrorMessage('Actor not available');
      setErrorDetails('The connection to the backend timed out. Please make sure you are logged in and try again.');
      toast.error('Connection failed', { description: 'Backend connection timed out.' });
      setTimeout(() => navigate({ to: '/' }), 5000);
    }, ACTOR_WAIT_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once actor is ready, process the OAuth callback
  useEffect(() => {
    if (hasProcessed.current) return;
    if (actorFetching || !actor) return;

    // Actor is available — proceed
    hasProcessed.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (pollRef.current) clearInterval(pollRef.current);

    const handleOAuthCallback = async () => {
      setStatus('processing');
      try {
        console.log('[OAuthCallback] Actor ready, processing OAuth callback...');
        console.log('[OAuthCallback] Current URL:', window.location.href);

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        console.log('[OAuthCallback] URL params:', {
          hasCode: !!code,
          codeLength: code?.length,
          hasState: !!state,
          error,
          errorDescription,
        });

        if (error) {
          let userFriendlyMessage = 'OAuth authorization failed';
          if (error === 'access_denied') {
            userFriendlyMessage = 'You cancelled the authorization';
          } else if (errorDescription) {
            userFriendlyMessage = errorDescription;
          }
          throw new Error(userFriendlyMessage);
        }

        if (!code) {
          throw new Error('No authorization code received from Google. Please try connecting again.');
        }

        const savedState = sessionStorage.getItem('oauth_state');
        console.log('[OAuthCallback] State validation:', { received: state, saved: savedState });

        if (state !== savedState) {
          throw new Error('Invalid state parameter. This may be a security issue. Please try connecting again.');
        }

        sessionStorage.removeItem('oauth_state');

        const redirectUri = `${window.location.origin}/oauth/callback`;
        console.log('[OAuthCallback] Storing OAuth credentials with redirect URI:', redirectUri);

        // Store credentials in backend
        await storeOAuth({ authorizationCode: code, redirectUri });

        console.log('[OAuthCallback] OAuth credentials stored, forcing query refetch...');

        // Force refetch all connection-related queries to ensure fresh state
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['youtubeChannel'] }),
          queryClient.invalidateQueries({ queryKey: ['hasGoogleOAuth'] }),
          queryClient.invalidateQueries({ queryKey: ['isYouTubeConnected'] }),
          queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] }),
        ]);

        // Wait a moment then refetch to confirm the state is persisted
        await new Promise(resolve => setTimeout(resolve, 500));

        await Promise.all([
          queryClient.refetchQueries({ queryKey: ['youtubeChannel'] }),
          queryClient.refetchQueries({ queryKey: ['hasGoogleOAuth'] }),
          queryClient.refetchQueries({ queryKey: ['isYouTubeConnected'] }),
          queryClient.refetchQueries({ queryKey: ['currentUserProfile'] }),
        ]);

        console.log('[OAuthCallback] All queries refreshed, navigating home...');
        setStatus('success');
        toast.success('Google account connected successfully!');

        // Navigate after a short delay so the user sees the success state
        setTimeout(() => {
          navigate({ to: '/' });
        }, 1500);
      } catch (err) {
        console.error('[OAuthCallback] Error:', err);
        setStatus('error');

        const errorMsg = err instanceof Error ? err.message : 'Failed to complete OAuth flow';
        setErrorMessage(errorMsg);

        if (errorMsg.includes('Actor not available')) {
          setErrorDetails('Please make sure you are logged in and try again.');
        } else if (errorMsg.includes('state parameter')) {
          setErrorDetails('Security validation failed. This can happen if you opened multiple authorization windows. Please try again.');
        } else if (errorMsg.includes('Backend OAuth configuration')) {
          setErrorDetails('The backend Google OAuth credentials (client ID and secret) have not been configured. Please contact the administrator.');
        } else if (errorMsg.includes('cancelled')) {
          setErrorDetails('You cancelled the Google authorization. Click the button below to try again.');
        } else {
          setErrorDetails('An unexpected error occurred during the OAuth flow. Please try again.');
        }

        toast.error('Failed to connect Google account', { description: errorMsg });
        setTimeout(() => navigate({ to: '/' }), 5000);
      }
    };

    handleOAuthCallback();
  }, [actor, actorFetching, storeOAuth, navigate, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : status === 'error' ? (
              <AlertCircle className="w-5 h-5 text-destructive" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            )}
            {status === 'waiting' && 'Connecting to Backend...'}
            {status === 'processing' && 'Connecting Google Account...'}
            {status === 'success' && 'Connected Successfully!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription>
            {status === 'waiting' && 'Waiting for backend to initialize...'}
            {status === 'processing' && 'Processing your Google authorization...'}
            {status === 'success' && 'Your Google account has been connected. Redirecting...'}
            {status === 'error' && 'There was a problem connecting your Google account.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(status === 'waiting' || status === 'processing') && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {status === 'waiting'
                    ? 'Initializing backend connection...'
                    : 'Storing your credentials securely...'}
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-400">Success!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Your Google account has been connected. You can now post clips directly to YouTube.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>
                  <p className="font-medium">{errorMessage}</p>
                  {errorDetails && <p className="mt-1 text-sm opacity-90">{errorDetails}</p>}
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate({ to: '/' })}
                >
                  Go Home
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => navigate({ to: '/' })}
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
