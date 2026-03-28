// src/components/tools/UnlockOptions.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Unlock } from 'lucide-react';

interface UnlockOptionsProps {
  onUnlock: (password: string) => void;
}

export const UnlockOptions = ({ onUnlock }: UnlockOptionsProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!password) {
      setError('Please enter the password for your PDF.');
      return;
    }
    setError(null);
    onUnlock(password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">Enter Password to Unlock</h3>
        <p className="text-gray-500 text-sm mt-1">
          This password is required to open and remove protection from your PDF.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="password">PDF Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button
        onClick={handleSubmit}
        size="lg"
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
      >
        <Unlock className="mr-2 h-5 w-5" />
        Unlock PDF
      </Button>
    </div>
  );
};
