import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { actor, isFetching: actorFetching } = useActor();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const processedRef = useRef(false);

  // Detect if we're inside a popup window
  const isPopup = window.opener && window.opener !== window;

  useEffect(() => {
    // If this is a popup, we can parse the URL immediately and send a message
    // to the parent to handle token exchange there — but we still do the exchange
    // here so the backend stores credentials in the correct principal session.
    if (actorFetching || !actor) return;
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        // Parse the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash.replace("#", "?").slice(1),
        );

        const code = urlParams.get("code") || hashParams.get("code");
        const error = urlParams.get("error") || hashParams.get("error");

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received from Google");
        }

        const redirectUri = `${window.location.origin}/oauth/callback`;

        // Store the OAuth credentials via backend
        await actor.storeGoogleOAuthCredentials(code, redirectUri);

        setStatus("success");

        if (isPopup) {
          // Notify the parent window that OAuth succeeded
          try {
            window.opener.postMessage(
              { type: "YOUTUBE_OAUTH_SUCCESS" },
              window.location.origin,
            );
          } catch {
            // ignore cross-origin errors
          }
          // Close the popup after a brief delay so the user sees success
          setTimeout(() => {
            window.close();
          }, 1200);
        } else {
          // Invalidate queries and navigate back (mobile same-tab flow)
          await queryClient.invalidateQueries({ queryKey: ["youtubeChannel"] });
          await queryClient.invalidateQueries({
            queryKey: ["currentUserProfile"],
          });
          const returnPath = sessionStorage.getItem("oauthReturnPath") || "/";
          sessionStorage.removeItem("oauthReturnPath");
          setTimeout(() => {
            navigate({ to: returnPath as "/" });
          }, 1500);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("[OAuthCallback] Error:", message);
        setErrorMessage(message);
        setStatus("error");

        if (isPopup) {
          try {
            window.opener.postMessage(
              { type: "YOUTUBE_OAUTH_ERROR", message },
              window.location.origin,
            );
          } catch {
            // ignore
          }
          setTimeout(() => {
            window.close();
          }, 3000);
        } else {
          setTimeout(() => {
            navigate({ to: "/" });
          }, 3000);
        }
      }
    };

    handleCallback();
  }, [actor, actorFetching, navigate, queryClient, isPopup]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 shadow-lg max-w-sm w-full mx-4 backdrop-blur-sm">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <h2 className="text-lg font-semibold text-white">
              Connecting YouTube…
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we complete the connection.
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-green-400" />
            <h2 className="text-lg font-semibold text-white">
              YouTube Connected!
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              {isPopup
                ? "Connection successful. This window will close automatically."
                : "Your YouTube channel has been connected successfully. Redirecting…"}
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="w-12 h-12 text-destructive" />
            <h2 className="text-lg font-semibold text-white">
              Connection Failed
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              {errorMessage}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPopup ? "This window will close…" : "Redirecting back…"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
