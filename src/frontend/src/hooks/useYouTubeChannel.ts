import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
        const [hasOAuth, isYTConnected] = await Promise.all([
          actor.hasGoogleOAuthCredentials(),
          actor.isYouTubeChannelConnected(),
        ]);

        const isConnected = hasOAuth || isYTConnected;

        if (isConnected) {
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
      try {
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
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to start YouTube sign-in";
        toast.error(message);
        throw err;
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] });
      }, 1000);
    },
    onError: (err: Error) => {
      toast.error(
        err.message || "Failed to connect YouTube. Please try again.",
      );
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      try {
        // Try to revoke OAuth credentials if backend supports it
        if (typeof (actor as any).revokeGoogleOAuthCredentials === "function") {
          await (actor as any).revokeGoogleOAuthCredentials();
        } else {
          // Fall back: fetch current profile then save it without youtubeAuth
          const profile = await actor.getCallerUserProfile();
          if (!profile) throw new Error("No profile found");
          const updated = { ...profile } as import("../backend").UserProfile;
          updated.youtubeAuth = undefined;
          updated.googleOAuthCredentials = undefined;
          await actor.saveCallerUserProfile(updated);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to disconnect YouTube";
        toast.error(message);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] });
      queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
      toast.success("YouTube channel disconnected.");
    },
    onError: () => {
      toast.error("Failed to disconnect YouTube. Please try again.");
    },
  });

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
