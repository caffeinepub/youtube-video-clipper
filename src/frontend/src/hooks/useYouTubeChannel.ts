import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface YouTubeChannelStatus {
  isConnected: boolean;
  channelName?: string;
  channelId?: string;
}

export function useYouTubeChannel() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

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

      // Always navigate in the same tab — popups are blocked on most browsers/devices
      sessionStorage.setItem("oauthReturnPath", window.location.pathname);
      window.location.href = oauthUrl;
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] });
      }, 1000);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      // Fetch current profile then save it without youtubeAuth
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error("No profile found");
      const updated = { ...profile } as import("../backend").UserProfile;
      // Clear both auth fields
      updated.youtubeAuth = undefined;
      updated.googleOAuthCredentials = undefined;
      await actor.saveCallerUserProfile(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] });
      queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
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
    disconnectChannel: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
    error: connectMutation.error,
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] }),
  };
}
