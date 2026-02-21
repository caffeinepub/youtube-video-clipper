import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Youtube, Loader2, CheckCircle2, AlertCircle, Link2 } from 'lucide-react';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';

export default function ChannelConnection() {
  const { channelStatus, isLoading, connectChannel, disconnectChannel, error, isConfigured } = useYouTubeChannel();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      await connectChannel();
    } catch (err) {
      console.error('[ChannelConnection] Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectChannel();
    } catch (err) {
      console.error('[ChannelConnection] Disconnect error:', err);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-600" />
          YouTube Channel
        </CardTitle>
        <CardDescription>
          Connect your Google account to automatically post clips to your YouTube channel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {channelStatus?.isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(channelStatus.channelName || 'User')}&background=random`} />
                <AvatarFallback>{(channelStatus.channelName || 'U').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{channelStatus.channelName || 'My Channel'}</p>
                <p className="text-xs text-muted-foreground">Google account connected</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDisconnect}
              disabled={isConnecting}
            >
              Disconnect Google Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                No Google account connected
              </p>
              <p className="text-xs text-muted-foreground">
                Connect your Google account to enable automatic posting to YouTube
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={isConnecting || !isConfigured}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Youtube className="w-4 h-4 mr-2" />
                  Connect Google Account
                </>
              )}
            </Button>
          </div>
        )}

        {!isConfigured && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.
            </AlertDescription>
          </Alert>
        )}

        {error && isConfigured && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
