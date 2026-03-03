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

  const handleViewResume = () => {
    if (!user?.resumeUrl) return;
    
    // Check if it's a base64 data URL
    if (user.resumeUrl.startsWith('data:')) {
      // Create a blob and download it
      const base64Data = user.resumeUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } else {
      // It's a regular URL
      window.open(user.resumeUrl, '_blank', 'noopener,noreferrer');
    }
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

  const totalApplications = stats?.kpis.total || 0;

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
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
          Overview
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
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
              <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl bg-white/80 dark:bg-slate-900/60">
                <CardHeader className="pb-2 px-5 pt-5">
                  <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center justify-between">
                    {card.title}
                    <div className="p-2 rounded-lg bg-slate-900 dark:bg-slate-100">
                      <Icon className="h-4 w-4 text-white dark:text-slate-900" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <motion.div
                    className="text-3xl font-semibold text-slate-900 dark:text-slate-100"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  >
                    {typeof card.value === 'number' ? card.value : String(card.value || 0)}
                  </motion.div>
                  <div className="mt-3 h-1 w-16 rounded-full bg-slate-900/80 dark:bg-slate-100/80" />
                </CardContent>
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
          <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl bg-white/80 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <div className="p-2 bg-slate-900 dark:bg-slate-100 rounded-lg">
                  <FileText className="h-4 w-4 text-white dark:text-slate-900" />
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
                          ? 'border-slate-400 bg-slate-50 dark:bg-slate-900/50'
                          : 'border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/40'
                      }`}
                    >
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-500 dark:text-slate-400" />
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Drag & drop your resume here
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
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
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tip: File size limit is 2MB. For larger files, use the URL option instead.
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tip: Upload your resume to Google Drive or Dropbox, make it publicly viewable, and paste the link here.
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">Resume uploaded</p>
                      <button
                        onClick={handleViewResume}
                        className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 underline-offset-4 hover:underline"
                      >
                        View Resume →
                      </button>
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
          <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl bg-white/80 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <div className="p-2 bg-slate-900 dark:bg-slate-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
                Applications by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    content={(props: any) => {
                      if (!props.active || !props.payload?.length) return null;
                      const { name, count } = props.payload[0].payload;
                      const color = COLORS[name.toLowerCase() as keyof typeof COLORS] || '#6366f1';
                      return (
                        <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {count} application{count !== 1 ? 's' : ''}
                          </div>
                        </div>
                      );
                    }}
                    cursor={{ fill: 'rgba(100, 116, 139, 0.08)' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#6366f1'}
                      />
                    ))}
                  </Bar>
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
          <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl bg-white/80 dark:bg-slate-900/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <div className="p-2 bg-slate-900 dark:bg-slate-100 rounded-lg">
                  <Target className="h-4 w-4 text-white dark:text-slate-900" />
                </div>
                Distribution Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={68}
                        outerRadius={100}
                        paddingAngle={3}
                        cornerRadius={10}
                        startAngle={90}
                        endAngle={-270}
                        stroke="transparent"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-slate-900 dark:fill-slate-100"
                      >
                        {totalApplications}
                      </text>
                      <text
                        x="50%"
                        y="50%"
                        dy={18}
                        textAnchor="middle"
                        className="fill-slate-500 dark:fill-slate-400 text-xs"
                      >
                        Total
                      </text>
                      <Tooltip
                        content={(props: any) => {
                          if (!props.active || !props.payload?.length) return null;
                          const data = props.payload[0].payload;
                          const pct = totalApplications > 0
                            ? ((data.value / totalApplications) * 100).toFixed(1)
                            : '0';
                          return (
                            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: data.color }} />
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{data.name}</span>
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 pl-[18px]">
                                {data.value} application{data.value !== 1 ? 's' : ''} · {pct}%
                              </div>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800/70 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
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
        <Card className="border border-slate-200/80 dark:border-slate-800/80 shadow-sm rounded-2xl bg-white/80 dark:bg-slate-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <div className="p-2 bg-slate-900 dark:bg-slate-100 rounded-lg">
                <Clock className="h-4 w-4 text-white dark:text-slate-900" />
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
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-center">
                        <ActivityIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{String(activity.description || '')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              {!recentActivity?.length && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-slate-700 dark:text-slate-200" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
