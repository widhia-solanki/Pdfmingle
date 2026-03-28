// src/components/tools/ProtectOptions.tsx

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility

interface ProtectOptionsProps {
  onPasswordSet: (password: string) => void;
  // --- Optional prop to control button loading state ---
  isProcessing?: boolean;
}

export const ProtectOptions = ({ onPasswordSet, isProcessing = false }: ProtectOptionsProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null); // Clear previous errors
    if (!password) {
      setError('Password cannot be empty.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    onPasswordSet(password);
  };

  return (
    // --- THIS IS THE FIX ---
    // The main container now uses semantic theme variables.
    // I have removed the outer container from the page itself as it's better handled here.
    <div className="w-full bg-card border border-border rounded-xl shadow-lg p-6 sm:p-8 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Set a Password</h3>
        <p className="text-muted-foreground text-sm mt-1">
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
              className={cn("pr-10", error && "border-destructive")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
            className={cn(error && "border-destructive")}
          />
        </div>
      </div>

      {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}

      <Button
        onClick={handleSubmit}
        size="lg"
        disabled={isProcessing}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
      >
        <Lock className="mr-2 h-5 w-5" />
        {isProcessing ? 'Protecting...' : 'Protect PDF'}
      </Button>
    </div>
  );
};
