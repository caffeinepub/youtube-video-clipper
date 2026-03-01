import React from 'react';
import { Scissors } from 'lucide-react';
import ClipList from '../components/ClipList';

export default function MyClipsPage() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-display flex items-center gap-2">
          <Scissors size={24} className="text-indigo-400" />
          My Clips
        </h1>
        <p className="text-muted-foreground text-sm mt-1">All your saved clips in one place</p>
      </div>
      <ClipList />
    </div>
  );
}
