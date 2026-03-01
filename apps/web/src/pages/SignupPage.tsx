import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { SignUpInput, signUpSchema, UserRole, Company } from '@applytrack/shared';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setAccessToken } = useAuthStore();
  const [formData, setFormData] = useState<SignUpInput>({ 
    email: '', 
    password: '', 
    name: '',
    role: UserRole.APPLICANT,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Clear all cached data before signing up
      queryClient.clear();
      
      const validated = signUpSchema.parse(formData);
      const response = await apiClient.signup(validated);
      setUser(response.user);
      setAccessToken(response.accessToken);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Sign up failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const companies = Object.values(Company);

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
          <p className="text-2xl font-bold tracking-tight text-zinc-900">
            Apply<span className="text-teal-600">Track</span>
          </p>
          <p className="text-sm text-zinc-500 mt-1">Create your free account</p>
        </div>

        <Card className="border border-zinc-200 shadow-none">
          <CardHeader className="pb-2 pt-8 px-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">Get started</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">Sign up</h2>
            <p className="text-sm text-zinc-500 mt-1">Start tracking your applications today</p>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 text-destructive text-sm p-3 rounded-md"
                >
                  {error}
                </motion.div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="h-10"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
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
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  I am a
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    role: e.target.value as typeof UserRole[keyof typeof UserRole],
                    company: e.target.value === UserRole.APPLICANT ? undefined : formData.company
                  })}
                  className="w-full h-10 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value={UserRole.APPLICANT}>Job Applicant</option>
                  <option value={UserRole.RECRUITER}>Recruiter</option>
                </select>
              </div>
              {formData.role === UserRole.RECRUITER && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <select
                    id="company"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      company: e.target.value as typeof Company[keyof typeof Company]
                    })}
                    className="w-full h-10 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  required
                  className="h-10"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-10 rounded-full bg-zinc-900 text-white hover:bg-zinc-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : (
                  <span className="flex items-center justify-center gap-2">
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-zinc-500">
                    Already have an account?
                  </span>
                </div>
              </div>
              <Link to="/login">
                <Button type="button" variant="outline" className="w-full h-10">
                  Sign in instead
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-500 mt-6">
          By creating an account, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
