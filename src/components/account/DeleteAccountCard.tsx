// src/components/account/DeleteAccountCard.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'next-auth/react';

export const DeleteAccountCard = () => {
  const { toast } = useToast();

  const handleDeleteAccount = async () => {
    toast({ title: 'Action Required', description: 'This action is permanent. Please contact support to proceed.', variant: 'destructive' });
    // In a real app, this would call a backend endpoint and then sign out
    // await fetch('/api/account/delete', { method: 'DELETE' });
    // await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <Card className="border-destructive">
      <CardHeader><CardTitle className="text-destructive">Delete Account</CardTitle><CardDescription>Permanently delete your account and all of your data. This action cannot be undone.</CardDescription></CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive">Delete My Account</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action is permanent. This will permanently delete your account and remove all your data from our servers.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAccount}>Yes, delete my account</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
