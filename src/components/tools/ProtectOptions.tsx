// src/components/tools/ProtectOptions.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface ProtectOptionsProps {
  onPasswordSet: (password: string) => void;
}

export const ProtectOptions = ({ onPasswordSet }: ProtectOptionsProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!password) {
      setError('Password cannot be empty.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    onPasswordSet(password);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white border rounded-xl shadow-lg space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800">Set a Password</h3>
        <p className="text-gray-500 text-sm mt-1">
          This password will be required to open the PDF.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="password">Password</Label>
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
        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Button
        onClick={handleSubmit}
        size="lg"
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
      >
        <Lock className="mr-2 h-5 w-5" />
        Protect PDF
      </Button>
    </div>
  );
};
