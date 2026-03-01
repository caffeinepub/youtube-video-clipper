import React, { useState, useRef } from 'react';
import { User, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { ExternalBlob, UserRole, UserStatus } from '../backend';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBlob, setAvatarBlob] = useState<ExternalBlob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(bytes);
    setAvatarBlob(blob);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let profilePicture: ExternalBlob | undefined = undefined;

    if (avatarBlob && actor) {
      try {
        setUploading(true);
        await actor.uploadProfilePicture(avatarBlob);
        profilePicture = avatarBlob;
      } catch (err) {
        toast.error('Failed to upload profile picture');
      } finally {
        setUploading(false);
      }
    }

    saveProfile({
      name: name.trim(),
      role: UserRole.user,
      status: UserStatus.active,
      youtubeAuth: undefined,
      googleOAuthCredentials: undefined,
      profilePicture,
    });
  };

  if (!identity) return null;

  return (
    <Dialog open>
      <DialogContent
        className="sm:max-w-md border-white/10"
        style={{ backgroundColor: '#161b27' }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-display text-xl">Welcome to Beast Clipping! 🎬</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up your profile to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500/40 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <User size={28} className="text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={18} className="text-white" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Upload size={12} />
              Upload photo (optional)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Your Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-indigo-500/60"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || uploading || !name.trim()}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {isPending || uploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {uploading ? 'Uploading...' : 'Saving...'}
              </span>
            ) : (
              'Get Started 🚀'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
