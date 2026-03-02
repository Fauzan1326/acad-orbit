import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      toast.error('Invalid reset link');
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated successfully');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8">
        <h1 className="text-xl font-bold mb-2">Set New Password</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">New Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required minLength={6}
                className="pl-10 bg-secondary/50" />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
