import React from 'react';
import ClipList from '../components/ClipList';
import { Scissors } from 'lucide-react';

export default function MyClipsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Scissors size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Clips</h1>
          <p className="text-sm text-muted-foreground">Manage and review your video clips</p>
        </div>
      </div>
      <ClipList />
    </div>
  );
}
