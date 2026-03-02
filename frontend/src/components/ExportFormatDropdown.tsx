import React, { useState } from 'react';
import { ChevronDown, Film, Image, Music } from 'lucide-react';

export type ExportFormat = 'mp4' | 'gif' | 'mp3';

interface ExportFormatDropdownProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const formats = [
  { value: 'mp4' as ExportFormat, label: 'MP4 (High Res)', icon: Film, ext: '.mp4' },
  { value: 'gif' as ExportFormat, label: 'GIF (Meme Format)', icon: Image, ext: '.gif' },
  { value: 'mp3' as ExportFormat, label: 'MP3 (Audio Only)', icon: Music, ext: '.mp3' },
];

export default function ExportFormatDropdown({ value, onChange }: ExportFormatDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = formats.find((f) => f.value === value) || formats[0];
  const Icon = selected.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs cyberpunk-btn px-2 py-1.5 rounded-lg transition-smooth"
      >
        <Icon className="w-3 h-3" />
        <span>{selected.ext}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-8 right-0 z-50 glass-card rounded-xl border border-cyan-neon/30 overflow-hidden w-44 animate-fade-in-up">
            {formats.map((fmt) => {
              const FmtIcon = fmt.icon;
              return (
                <button
                  key={fmt.value}
                  onClick={() => {
                    onChange(fmt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-smooth hover:bg-cyan-neon/10 ${
                    fmt.value === value ? 'text-cyan-neon bg-cyan-neon/5' : 'text-foreground'
                  }`}
                >
                  <FmtIcon className="w-3 h-3" />
                  {fmt.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
