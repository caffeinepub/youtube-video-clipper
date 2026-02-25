import { useEffect, useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStoreGoogleOAuth } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

const ACTOR_WAIT_TIMEOUT_MS = 15000; // 15 seconds

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { actor, isFetching: actorFetching } = useActor();
  const { mutateAsync: storeOAuth } = useStoreGoogleOAuth();
  const [status, setStatus] = useState<'waiting' | 'processing' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const hasProcessed = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Set a timeout: if actor never becomes available, show error
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (hasProcessed.current) return;
      if (status === 'waiting' || status === 'processing') {
        hasProcessed.current = true;
        setStatus('error');
        setErrorMessage('Actor not available');
        setErrorDetails('The connection to the backend timed out. Please make sure you are logged in and try again.');
        toast.error('Connection failed', { description: 'Backend connection timed out.' });
        setTimeout(() => navigate({ to: '/' }), 5000);
      }
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

        await storeOAuth({ authorizationCode: code, redirectUri });

        console.log('[OAuthCallback] OAuth credentials stored successfully');
        setStatus('success');
        toast.success('Google account connected successfully!');

        setTimeout(() => {
          navigate({ to: '/' });
        }, 2000);
      } catch (err) {
        console.error('[OAuthCallback] Error:', err);
        setStatus('error');

        const errorMsg = err instanceof Error ? err.message : 'Failed to complete OAuth flow';
        setErrorMessage(errorMsg);

        if (errorMsg.includes('Actor not available')) {
          setErrorDetails('Please make sure you are logged in and try again.');
        } else if (errorMsg.includes('state parameter')) {
          setErrorDetails('Security validation failed. This can happen if you opened multiple authorization windows.');
        } else if (errorMsg.includes('authorization code')) {
          setErrorDetails('The authorization code from Google was invalid or missing.');
        }

        toast.error('Connection failed', { description: errorMsg });

        setTimeout(() => {
          navigate({ to: '/' });
        }, 5000);
      }
    };

    handleOAuthCallback();
  }, [actor, actorFetching, navigate, storeOAuth]);

  const handleRetry = () => {
    navigate({ to: '/' });
  };

  const isWaiting = status === 'waiting' || (status === 'processing' && actorFetching);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connecting Your Account</CardTitle>
          <CardDescription>
            {(status === 'waiting') && 'Initializing connection...'}
            {status === 'processing' && 'Please wait while we connect your Google account...'}
            {status === 'success' && 'Successfully connected!'}
            {status === 'error' && 'Connection failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(isWaiting || status === 'processing') && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {status === 'waiting' ? 'Waiting for backend connection...' : 'Connecting to Google...'}
              </p>
              <p className="text-xs text-muted-foreground">This may take a few moments</p>
            </div>
          )}

          {status === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your Google account has been connected successfully. Redirecting you back to the app...
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>{errorMessage}</p>
                  {errorDetails && (
                    <p className="text-xs mt-2">{errorDetails}</p>
                  )}
                  <p className="text-xs mt-2">Redirecting back to home page in 5 seconds...</p>
                </AlertDescription>
              </Alert>
              <Button onClick={handleRetry} className="w-full" variant="outline">
                Return to Home Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
