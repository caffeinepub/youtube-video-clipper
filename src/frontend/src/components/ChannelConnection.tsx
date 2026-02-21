import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Youtube, Loader2, CheckCircle2, AlertCircle, Link2 } from 'lucide-react';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';

export default function ChannelConnection() {
  console.log('[ChannelConnection] Component rendering');
  
  const { channelStatus, isLoading, connectChannel, disconnectChannel, error } = useYouTubeChannel();
  const [isConnecting, setIsConnecting] = useState(false);

  console.log('[ChannelConnection] State:', {
    channelStatus,
    isLoading,
    isConnecting,
    error,
    timestamp: new Date().toISOString()
  });

  const handleConnect = async () => {
    console.log('[ChannelConnection] handleConnect - START', {
      timestamp: new Date().toISOString()
    });
    
    setIsConnecting(true);
    
    try {
      console.log('[ChannelConnection] Calling connectChannel mutation...');
      const result = await connectChannel();
      console.log('[ChannelConnection] connectChannel - SUCCESS', {
        result,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[ChannelConnection] connectChannel - ERROR', {
        error: err,
        errorMessage: err instanceof Error ? err.message : String(err),
        errorStack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString()
      });
    } finally {
      console.log('[ChannelConnection] handleConnect - FINALLY, setting isConnecting to false');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    console.log('[ChannelConnection] handleDisconnect - START', {
      timestamp: new Date().toISOString()
    });
    
    try {
      console.log('[ChannelConnection] Calling disconnectChannel mutation...');
      await disconnectChannel();
      console.log('[ChannelConnection] disconnectChannel - SUCCESS', {
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('[ChannelConnection] disconnectChannel - ERROR', {
        error: err,
        errorMessage: err instanceof Error ? err.message : String(err),
        errorStack: err instanceof Error ? err.stack : undefined,
        timestamp: new Date().toISOString()
      });
    }
  };

  if (isLoading) {
    console.log('[ChannelConnection] Rendering loading state');
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

  console.log('[ChannelConnection] Rendering main UI', {
    isConnected: channelStatus?.isConnected,
    channelName: channelStatus?.channelName
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-red-600" />
          YouTube Channel
        </CardTitle>
        <CardDescription>
          Connect your YouTube channel to post clips directly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {channelStatus?.isConnected && channelStatus.channelName ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(channelStatus.channelName)}&background=random`} />
                <AvatarFallback>{channelStatus.channelName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{channelStatus.channelName}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleDisconnect}
              disabled={isConnecting}
            >
              Disconnect Channel
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <Link2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No channel connected yet
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Youtube className="w-4 h-4 mr-2" />
                  Connect YouTube Channel
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
