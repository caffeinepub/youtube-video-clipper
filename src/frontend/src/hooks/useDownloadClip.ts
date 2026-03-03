import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useActor } from "./useActor";

interface DownloadClipParams {
  videoId: string;
  startTime: number;
  endTime: number;
  title?: string;
}

export function useDownloadClip() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      videoId,
      startTime,
      endTime,
      title,
    }: DownloadClipParams) => {
      if (!actor) throw new Error("Not connected to backend");

      if (startTime >= endTime) {
        throw new Error(
          "Invalid timestamps: start time must be less than end time",
        );
      }

      const url = await actor.generateDownloadVideoUrl(
        videoId,
        BigInt(Math.floor(startTime)),
        BigInt(Math.floor(endTime)),
      );

      if (!url) throw new Error("Failed to generate download URL");

      // For cross-origin URLs, window.open is the reliable approach
      // link.download only works for same-origin URLs
      const filename = title
        ? `${title.replace(/[^a-z0-9]/gi, "_")}_${startTime}-${endTime}.mp4`
        : `clip_${videoId}_${startTime}-${endTime}.mp4`;

      // Try fetch approach first (works if CORS allows it)
      try {
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          return url;
        }
      } catch {
        // CORS blocked or fetch failed — fall through to window.open
      }

      // Fallback: open in new tab so the browser handles the download
      window.open(url, "_blank", "noopener,noreferrer");
      return url;
    },
    onSuccess: () => {
      toast.success("Download started!");
    },
    onError: (error: Error) => {
      toast.error(`Download failed: ${error.message}`);
    },
  });
}
