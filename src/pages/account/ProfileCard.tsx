// src/components/account/ProfileCard.tsx

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save } from 'lucide-react';

export const ProfileCard = () => {
  const { data: session, update } = useSession();
  const user = session?.user;
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return user?.email?.[0].toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // This is a mock update. In a real app, you would fetch your backend.
      await new Promise(res => setTimeout(res, 1000));
      await update({ name: displayName });
      toast({ title: 'Success', description: 'Your profile has been updated.' });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePictureUpload = () => {
    toast({ title: 'Coming Soon!', description: 'Profile picture uploads will be available shortly.' });
  };

  return (
    <Card>
      <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Your personal information.</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20"><AvatarImage src={user?.image || ''} alt={user?.name || ''} /><AvatarFallback className="text-2xl">{getInitials(user?.name)}</AvatarFallback></Avatar>
          <Button variant="outline" onClick={handlePictureUpload}>Change Picture</Button>
        </div>
        <div className="space-y-2"><Label>Email Address</Label><p className="text-sm font-medium text-muted-foreground">{user?.email}</p></div>
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSaving} />
              <Button onClick={handleSaveProfile} size="icon" disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}</Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{user?.name || 'Not set'}</p>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}><Edit className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
