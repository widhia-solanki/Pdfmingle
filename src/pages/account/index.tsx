// src/pages/account/index.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ProfileCard } from '@/components/account/ProfileCard';
import { SettingsCard } from '@/components/account/SettingsCard';
import { DeleteAccountCard } from '@/components/account/DeleteAccountCard';
import { Separator } from '@/components/ui/separator';

const AccountPage: NextPage = () => {
  return (
    // AuthGuard ensures only logged-in users can see this page.
    <AuthGuard>
      <NextSeo title="My Account" noindex={true} />
      <div className="container mx-auto max-w-4xl py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            My Account
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </header>
        
        <div className="space-y-8">
          <ProfileCard />
          <Separator />
          <SettingsCard />
          <Separator />
          <DeleteAccountCard />
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
