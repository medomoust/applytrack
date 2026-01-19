import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Users, Award, Clock, Target, Building2, Sparkles, FileText, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const isRecruiter = user?.role === 'recruiter';
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  
  const { data: stats, isLoading, error, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.getDashboardStats(),
    retry: 1,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => apiClient.getRecentActivity(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { resumeUrl: string | null }) => apiClient.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser);
      useAuthStore.setState({ user: updatedUser });
      toast.success('Resume updated successfully!');
      setIsEditingResume(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update resume');
    },
  });

  const handleSaveResume = () => {
    updateProfileMutation.mutate({ resumeUrl: resumeUrl || null });
  };

  const handleRemoveResume = () => {
    setResumeUrl('');
    updateProfileMutation.mutate({ resumeUrl: null });
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('doc')) {
      toast.error('Please upload a PDF or DOC file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB. Please compress your resume or use the URL option for larger files.');
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Uploading resume...');

    // Convert to base64 for simple storage
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        toast.dismiss(loadingToast);
        updateProfileMutation.mutate({ resumeUrl: base64 });
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error('Failed to process file. Please try again or use the URL option.');
      }
    };
    reader.onerror = () => {
      toast.dismiss(loadingToast);
      toast.error('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-destructive mb-2">Failed to load dashboard</p>
              <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const statusData = Object.entries(stats?.byStatus || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count: value,
  }));

  // Colors for different statuses
  const COLORS = {
    wishlist: '#94a3b8',
    applied: '#3b82f6',
    interview: '#8b5cf6',
    offer: '#10b981',
    rejected: '#ef4444',
    ghosted: '#f59e0b',
  };

  const pieData = Object.entries(stats?.byStatus || {})
    .filter(([_, value]) => (value as number) > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
      color: COLORS[name as keyof typeof COLORS] || '#6366f1',
    }));

  const kpiCards = [
    {
      title: isRecruiter ? 'Total Applications' : 'Total Applications',
      value: stats?.kpis.total || 0,
      icon: Briefcase,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
    },
    {
      title: isRecruiter ? 'Open Positions' : 'Applied This Week',
      value: isRecruiter ? (stats?.recruiterStats?.openPositions || 0) : (stats?.kpis.appliedThisWeek || 0),
      icon: isRecruiter ? Target : TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
    },
    {
      title: isRecruiter ? 'Unique Applicants' : 'Interviews',
      value: isRecruiter ? (stats?.recruiterStats?.uniqueApplicants || 0) : (stats?.kpis.interviews || 0),
      icon: isRecruiter ? Users : Clock,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
    },
    {
      title: 'Offers',
      value: stats?.kpis.offers || 0,
      icon: Award,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
    },
  ];

  const activityIcons: Record<string, any> = {
    application_created: Briefcase,
    application_updated: TrendingUp,
    job_posted: Building2,
    default: Sparkles,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          {isRecruiter ? 'Overview of your company\'s recruitment' : 'Overview of your job applications'}
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${card.bgGradient}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                    {card.title}
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${card.gradient}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div
                    className="text-3xl font-bold"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    {card.value}
                  </motion.div>
                  <div className={`mt-2 h-1 w-20 rounded-full bg-gradient-to-r ${card.gradient}`} />
                </CardContent>
                
                {/* Decorative gradient orb */}
                <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl`} />
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Resume Section (Applicants Only) */}
      {!isRecruiter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg border-2 border-dashed border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingResume || !user?.resumeUrl ? (
                <div className="space-y-4">
                  {/* Toggle between file upload and URL */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      type="button"
                      variant={uploadMethod === 'file' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadMethod('file')}
                    >
                      Upload File
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMethod === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUploadMethod('url')}
                    >
                      Add URL
                    </Button>
                  </div>

                  {uploadMethod === 'file' ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-300 dark:border-gray-700'
                      }`}
                    >
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-2">
                        Drag & drop your resume here
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        or click to browse (PDF, DOC - Max 2MB)
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('resume-upload')?.click()}
                      >
                        Choose File
                      </Button>
                      {isEditingResume && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2 ml-2"
                          onClick={() => {
                            setIsEditingResume(false);
                            setResumeUrl(user?.resumeUrl || '');
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="Enter your resume URL (Google Drive, Dropbox, etc.)"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSaveResume}
                        disabled={updateProfileMutation.isPending || !resumeUrl}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                      {isEditingResume && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditingResume(false);
                            setResumeUrl(user?.resumeUrl || '');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {uploadMethod === 'file' ? (
                    <p className="text-sm text-muted-foreground">
                      💡 Tip: File size limit is 2MB. For larger files, use the URL option instead.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      💡 Tip: Upload your resume to Google Drive or Dropbox, make it publicly viewable, and paste the link here
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Resume uploaded</p>
                      <a 
                        href={user.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        View Resume →
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditingResume(true)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRemoveResume}
                      disabled={updateProfileMutation.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                Applications by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      color: '#1f2937',
                    }}
                    cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                Distribution Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        color: '#1f2937',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data to display
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.slice(0, 5).map((activity: any, index: number) => {
                const ActivityIcon = activityIcons[activity.eventType] || activityIcons.default;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <ActivityIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              {!recentActivity?.length && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
