import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useActor } from "./useActor";

export interface YouTubeChannelStatus {
  isConnected: boolean;
  channelName?: string;
  channelId?: string;
}

export function useYouTubeChannel() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  // Listen for postMessage from the OAuth popup when it completes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "YOUTUBE_OAUTH_SUCCESS") {
        // Immediately mark as connected and schedule a real refetch
        queryClient.setQueryData<YouTubeChannelStatus>(["youtubeChannel"], {
          isConnected: true,
          channelName: "YouTube Connected",
        });
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] });
        }, 1500);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [queryClient]);

  const channelQuery = useQuery<YouTubeChannelStatus>({
    queryKey: ["youtubeChannel"],
    queryFn: async () => {
      if (!actor) return { isConnected: false };
      try {
        // Check both OAuth credentials and YouTube channel connection in parallel
        const [hasOAuth, isYTConnected] = await Promise.all([
          actor.hasGoogleOAuthCredentials(),
          actor.isYouTubeChannelConnected(),
        ]);

        const isConnected = hasOAuth || isYTConnected;

        if (isConnected) {
          // Try to get channel details from profile
          try {
            const profile = await actor.getCallerUserProfile();
            if (profile?.youtubeAuth) {
              return {
                isConnected: true,
                channelName: profile.youtubeAuth.channelName,
                channelId: profile.youtubeAuth.channelId,
              };
            }
            if (profile?.googleOAuthCredentials) {
              return {
                isConnected: true,
                channelName: "YouTube Connected",
              };
            }
          } catch {
            // ignore profile fetch errors
          }
          return { isConnected: true };
        }

        return { isConnected: false };
      } catch (err) {
        console.error("[useYouTubeChannel] query error:", err);
        return { isConnected: false };
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error(
          "Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID.",
        );
      }
      const redirectUri = `${window.location.origin}/oauth/callback`;
      const scope = [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
        "openid",
        "email",
        "profile",
      ].join(" ");

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope,
        access_type: "offline",
        prompt: "consent",
      });

      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

      // Open OAuth in a popup instead of navigating away
      const popup = window.open(
        oauthUrl,
        "youtube-oauth",
        "width=600,height=700,scrollbars=yes,resizable=yes",
      );

      if (!popup) {
        // Fallback: if popup was blocked, navigate in same tab
        window.location.href = oauthUrl;
        return;
      }

      // Wait for popup to close (fallback polling in case postMessage doesn't fire)
      await new Promise<void>((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            resolve();
          }
        }, 500);
      });
    },
    onSuccess: () => {
      // Invalidate to re-fetch real data after the popup closed
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] });
      }, 1000);
    },
  });

  // Derive loading state: loading if actor is still fetching OR query is loading for the first time
  const isLoading =
    actorFetching || (channelQuery.isLoading && !channelQuery.isFetched);

  const channelStatus: YouTubeChannelStatus = channelQuery.data ?? {
    isConnected: false,
  };

  return {
    channelStatus,
    isLoading,
    connectChannel: connectMutation.mutate,
    isConnecting: connectMutation.isPending,
    error: connectMutation.error,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] }),
  };
}
