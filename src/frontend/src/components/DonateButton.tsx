import { Heart } from "lucide-react";
import React from "react";

const PAYPAL_STORAGE_KEY = "beast_paypal_url";

export function getPayPalUrl(): string {
  try {
    return localStorage.getItem(PAYPAL_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setPayPalUrl(url: string): void {
  try {
    localStorage.setItem(PAYPAL_STORAGE_KEY, url);
  } catch {}
}

interface DonateButtonProps {
  isOwner?: boolean;
  className?: string;
}

export default function DonateButton({
  isOwner = false,
  className = "",
}: DonateButtonProps) {
  const paypalUrl = getPayPalUrl();

  if (!paypalUrl) {
    if (!isOwner) return null;
    return (
      <div
        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-muted-foreground/50 border border-dashed border-white/10 ${className}`}
      >
        <Heart className="w-3.5 h-3.5 text-pink-400/50 flex-shrink-0" />
        <span className="text-xs">Set up Donate in Admin Panel</span>
      </div>
    );
  }

  return (
    <a
      href={paypalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-400/30 transition-all duration-200 ${className}`}
      data-ocid="donate.button"
    >
      <Heart className="w-3.5 h-3.5 flex-shrink-0 fill-current" />
      Donate
    </a>
  );
}
