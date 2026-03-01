import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LoginInput, loginSchema } from '@applytrack/shared';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Briefcase, Users, ArrowRight, User, Lock } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setAccessToken } = useAuthStore();
  const [formData, setFormData] = useState<LoginInput>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clear all cached data before logging in
      queryClient.clear();
      
      const validated = loginSchema.parse(formData);
      const response = await apiClient.login(validated);
      setUser(response.user);
      setAccessToken(response.accessToken);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-background"
      style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Typographic wordmark */}
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            Apply<span className="text-primary">Track</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your workspace</p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-2 pt-6 px-6">
            <h2 className="text-xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Enter your credentials to continue</p>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 text-destructive text-sm p-3 rounded-md"
                >
                  {error}
                </motion.div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="h-10"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="h-10"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in…' : (
                  <span className="flex items-center justify-center gap-2">
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">New to ApplyTrack?</span>
                </div>
              </div>
              <Link to="/signup">
                <Button type="button" variant="outline" className="w-full h-10">
                  Create an account
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Card className="border bg-muted/40">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Demo accounts
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">Recruiter</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs text-foreground">recruiter@meta.com</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs text-foreground">Password123!</code>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border border-border bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">Applicant</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs text-foreground">john.doe@email.com</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs text-foreground">Password123!</code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
