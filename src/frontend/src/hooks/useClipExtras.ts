import { useCallback } from "react";
import { getLocalStorageItem, setLocalStorageItem } from "./useLocalStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClipCategory = "Funny" | "Hype" | "Fail" | "Gaming" | "Other";
export type ExpiryOption = "none" | "7days" | "30days" | "90days";

export interface ClipComment {
  id: string;
  clipId: string;
  authorName: string;
  body: string;
  createdAt: number;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const favKey = (clipId: string) => `beastclipping_fav_${clipId}`;
const tagsKey = (clipId: string) => `beastclipping_tags_${clipId}`;
const reactionsKey = (clipId: string) => `beastclipping_reactions_${clipId}`;
const commentsKey = (clipId: string) => `beastclipping_comments_${clipId}`;
const expiryKey = (clipId: string) => `beastclipping_expiry_${clipId}`;
const viewsKey = (clipId: string) => `beastclipping_views_${clipId}`;

// ─── Favorites ────────────────────────────────────────────────────────────────

export function isFavorite(clipId: string): boolean {
  return getLocalStorageItem<boolean>(favKey(clipId), false);
}

export function toggleFavorite(clipId: string): boolean {
  const current = isFavorite(clipId);
  const next = !current;
  setLocalStorageItem(favKey(clipId), next);
  return next;
}

// ─── Tags / Categories ────────────────────────────────────────────────────────

export function getClipTags(clipId: string): ClipCategory[] {
  return getLocalStorageItem<ClipCategory[]>(tagsKey(clipId), []);
}

export function setClipTags(clipId: string, tags: ClipCategory[]): void {
  setLocalStorageItem(tagsKey(clipId), tags);
}

export function toggleClipTag(
  clipId: string,
  tag: ClipCategory,
): ClipCategory[] {
  const current = getClipTags(clipId);
  const next = current.includes(tag)
    ? current.filter((t) => t !== tag)
    : [...current, tag];
  setClipTags(clipId, next);
  return next;
}

// ─── Reactions ────────────────────────────────────────────────────────────────

interface ReactionsData {
  count: number;
  reacted: boolean;
}

export function getReactions(clipId: string): ReactionsData {
  return getLocalStorageItem<ReactionsData>(reactionsKey(clipId), {
    count: 0,
    reacted: false,
  });
}

export function toggleReaction(clipId: string): ReactionsData {
  const current = getReactions(clipId);
  const next: ReactionsData = {
    count: current.reacted ? current.count - 1 : current.count + 1,
    reacted: !current.reacted,
  };
  setLocalStorageItem(reactionsKey(clipId), next);
  return next;
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export function getComments(clipId: string): ClipComment[] {
  return getLocalStorageItem<ClipComment[]>(commentsKey(clipId), []);
}

export function addComment(
  clipId: string,
  authorName: string,
  body: string,
): ClipComment {
  const comment: ClipComment = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    clipId,
    authorName,
    body,
    createdAt: Date.now(),
  };
  const current = getComments(clipId);
  setLocalStorageItem(commentsKey(clipId), [...current, comment]);
  return comment;
}

export function getCommentCount(clipId: string): number {
  return getComments(clipId).length;
}

// ─── Expiry ───────────────────────────────────────────────────────────────────

interface ExpiryData {
  option: ExpiryOption;
  expiresAt: number | null; // timestamp ms
}

export function getClipExpiry(clipId: string): ExpiryData {
  return getLocalStorageItem<ExpiryData>(expiryKey(clipId), {
    option: "none",
    expiresAt: null,
  });
}

export function setClipExpiry(clipId: string, option: ExpiryOption): void {
  const days =
    option === "7days"
      ? 7
      : option === "30days"
        ? 30
        : option === "90days"
          ? 90
          : null;
  const expiresAt = days ? Date.now() + days * 24 * 60 * 60 * 1000 : null;
  setLocalStorageItem(expiryKey(clipId), { option, expiresAt });
}

export function isClipExpired(clipId: string): boolean {
  const { expiresAt } = getClipExpiry(clipId);
  if (!expiresAt) return false;
  return Date.now() > expiresAt;
}

// ─── View Count ───────────────────────────────────────────────────────────────

export function getViewCount(clipId: string): number {
  return getLocalStorageItem<number>(viewsKey(clipId), 0);
}

export function incrementViewCount(clipId: string): number {
  const current = getViewCount(clipId);
  const next = current + 1;
  setLocalStorageItem(viewsKey(clipId), next);
  return next;
}

// ─── All views (for analytics) ────────────────────────────────────────────────

export function getAllViewCounts(): Record<string, number> {
  const result: Record<string, number> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("beastclipping_views_")) {
        const clipId = key.replace("beastclipping_views_", "");
        result[clipId] = getViewCount(clipId);
      }
    }
  } catch {
    // ignore
  }
  return result;
}

// ─── Hook (for reactive state) ────────────────────────────────────────────────

export function useClipExtras(clipId: string) {
  // We use useState with direct localStorage reads to avoid re-render issues
  const refresh = useCallback(() => {
    // Components should manage their own state, this hook provides utils
  }, []);

  return {
    isFavorite: () => isFavorite(clipId),
    toggleFavorite: () => toggleFavorite(clipId),
    getClipTags: () => getClipTags(clipId),
    setClipTags: (tags: ClipCategory[]) => setClipTags(clipId, tags),
    toggleClipTag: (tag: ClipCategory) => toggleClipTag(clipId, tag),
    getReactions: () => getReactions(clipId),
    toggleReaction: () => toggleReaction(clipId),
    getComments: () => getComments(clipId),
    addComment: (authorName: string, body: string) =>
      addComment(clipId, authorName, body),
    getCommentCount: () => getCommentCount(clipId),
    getClipExpiry: () => getClipExpiry(clipId),
    setClipExpiry: (option: ExpiryOption) => setClipExpiry(clipId, option),
    isClipExpired: () => isClipExpired(clipId),
    getViewCount: () => getViewCount(clipId),
    incrementViewCount: () => incrementViewCount(clipId),
    refresh,
  };
}
