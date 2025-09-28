// src/pages/account/index.tsx

import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ProfileCard } from '@/pages/account/ProfileCard';
import { SettingsCard } from '@/pages/account/SettingsCard';
import { DeleteAccountCard } from '@/pages/account/DeleteAccountCard';

const AccountPage: NextPage = () => {
  return (
    <AuthGuard>
      <NextSeo title="My Account" noindex={true} />
      <div className="w-full bg-secondary py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Account & Settings
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage your profile, preferences, and account settings.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <SettingsCard />
              <DeleteAccountCard />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AccountPage;
