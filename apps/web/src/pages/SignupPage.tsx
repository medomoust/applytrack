import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SignUpInput, signUpSchema, UserRole, Company } from '@applytrack/shared';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';

export function SignupPage() {
  const navigate = useNavigate();
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
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign Up for ApplyTrack</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
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
                  // Clear company if switching to applicant
                  company: e.target.value === UserRole.APPLICANT ? undefined : formData.company
                })}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value={UserRole.APPLICANT}>Job Applicant</option>
                <option value={UserRole.RECRUITER}>Recruiter</option>
              </select>
            </div>
            {formData.role === UserRole.RECRUITER && (
              <div>
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
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
