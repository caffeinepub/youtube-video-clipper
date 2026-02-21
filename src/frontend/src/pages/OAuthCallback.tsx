import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStoreGoogleOAuth } from '../hooks/useQueries';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { mutateAsync: storeOAuth } = useStoreGoogleOAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        const savedState = sessionStorage.getItem('oauth_state');
        if (state !== savedState) {
          throw new Error('Invalid state parameter');
        }

        sessionStorage.removeItem('oauth_state');

        const redirectUri = `${window.location.origin}/oauth/callback`;
        
        await storeOAuth({
          authorizationCode: code,
          redirectUri,
        });

        setStatus('success');
        
        setTimeout(() => {
          navigate({ to: '/' });
        }, 2000);
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Failed to complete OAuth flow');
        
        setTimeout(() => {
          navigate({ to: '/' });
        }, 5000);
      }
    };

    handleOAuthCallback();
  }, [navigate, storeOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connecting Your Account</CardTitle>
          <CardDescription>
            {status === 'processing' && 'Please wait while we connect your Google account...'}
            {status === 'success' && 'Successfully connected!'}
            {status === 'error' && 'Connection failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Connecting to Google...</p>
            </div>
          )}

          {status === 'success' && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Your Google account has been connected successfully. Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
                <br />
                <span className="text-xs">Redirecting back to home page...</span>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
