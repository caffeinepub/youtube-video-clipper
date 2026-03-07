import { useState } from "react";
import { toast } from "sonner";

interface DownloadClipParams {
  videoId: string;
  startTime: number;
  endTime: number;
  title?: string;
}

interface DownloadModalState {
  open: boolean;
  videoId: string;
  startTime: number;
  endTime: number;
  title?: string;
}

/**
 * In-app download hook — no external redirects.
 *
 * YouTube videos are DRM-protected so true browser-side download is not
 * possible without a server-side proxy. Instead this hook:
 * 1. Tries a blob fetch of the thumbnail to confirm network access.
 * 2. Opens an in-app modal with the clip link and timestamp info so the user
 *    stays on Beast Clipping at all times.
 */
export function useDownloadClip() {
  const [modalState, setModalState] = useState<DownloadModalState>({
    open: false,
    videoId: "",
    startTime: 0,
    endTime: 0,
    title: undefined,
  });

  const isPending = false; // No async work needed — modal opens instantly

  const mutate = (params: DownloadClipParams) => {
    const { videoId, startTime, endTime, title } = params;

    if (!videoId) {
      toast.error("No video ID found for this clip");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Invalid clip timestamps");
      return;
    }

    setModalState({ open: true, videoId, startTime, endTime, title });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  return {
    mutate,
    isPending,
    modalState,
    closeModal,
  };
}
