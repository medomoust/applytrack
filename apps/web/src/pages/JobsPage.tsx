import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Search, MapPin, Briefcase, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function JobsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicationNotes, setApplicationNotes] = useState('');
  const [salaryTarget, setSalaryTarget] = useState<string>('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['job-postings', search],
    queryFn: () => apiClient.getJobPostings({ search, pageSize: 100, status: 'open' }),
  });

  // Debug logging
  console.log('JobsPage - search:', search);
  console.log('JobsPage - data:', data);
  console.log('JobsPage - isLoading:', isLoading);
  console.log('JobsPage - isError:', isError);
  console.log('JobsPage - error:', error);

  const applyMutation = useMutation({
    mutationFn: ({ jobId, notes, salary }: { jobId: string; notes?: string; salary?: number }) =>
      apiClient.applyToJobPosting(jobId, { notes, salaryTarget: salary }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['recent-activity'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      toast.success('Application submitted successfully!');
      setSelectedJob(null);
      setApplicationNotes('');
      setSalaryTarget('');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  const handleApply = () => {
    if (!selectedJob) return;
    applyMutation.mutate({
      jobId: selectedJob.id,
      notes: applicationNotes || undefined,
      salary: salaryTarget ? parseFloat(salaryTarget) : undefined,
    });
  };

  const jobs = Array.isArray(data?.data) ? data.data : [];
  
  // Debug logging
  console.log('JobsPage - jobs array:', jobs);
  console.log('JobsPage - jobs length:', jobs.length);
  if (jobs.length > 0) {
    console.log('JobsPage - first job:', jobs[0]);
  }

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Browse Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Find and apply to open positions
            </p>
          </div>
        </motion.div>
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </Card>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Early return for error state
  if (isError) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Browse Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Find and apply to open positions
            </p>
          </div>
        </motion.div>
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </Card>
        <Card className="p-8">
          <EmptyState
            icon={Briefcase}
            title="Failed to load jobs"
            description={error instanceof Error ? error.message : 'Please try again'}
            action={
              <Button onClick={() => window.location.reload()} variant="outline">
                Reload Page
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  // Early return for empty state
  if (!data || !jobs || jobs.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Browse Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Find and apply to open positions
            </p>
          </div>
        </motion.div>
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </Card>
        <Card className="p-8">
          <EmptyState
            icon={Briefcase}
            title={search ? "No results found" : "No jobs available"}
            description={search ? `No job postings match "${search}"` : "Check back later for new opportunities"}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Browse Jobs
          </h1>
          <p className="text-muted-foreground mt-1">
            Find and apply to open positions
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by role or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Jobs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job: any) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedJob(job)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{String(job.roleTitle || '')}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{String(job.company || '')}</span>
                    </div>
                  </div>
                  <Badge variant="default">Open</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{String(job.location)}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Badge variant="outline" className="capitalize">{String(job.workMode || '')}</Badge>
                    <Badge variant="outline" className="capitalize">{String(job.employmentType || '')}</Badge>
                  </div>
                  {job.salaryRange && (
                    <p className="text-sm font-medium text-primary">{String(job.salaryRange)}</p>
                  )}
                </div>

                {job.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {String(job.description)}
                  </p>
                )}

                <Button className="w-full mt-4" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedJob(job);
                }}>
                  Apply Now
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

      {/* Application Dialog */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob.roleTitle}</DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">{selectedJob.company}</span>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Job Details */}
              <div>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline" className="capitalize">{selectedJob.workMode}</Badge>
                  <Badge variant="outline" className="capitalize">{selectedJob.employmentType}</Badge>
                </div>
                {selectedJob.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                )}
                {selectedJob.salaryRange && (
                  <p className="text-sm font-medium text-primary">{selectedJob.salaryRange}</p>
                )}
              </div>

              {selectedJob.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </div>
              )}

              {selectedJob.requirements && (
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedJob.requirements}
                  </p>
                </div>
              )}

              {/* Application Form */}
              <div className="border-t pt-6 space-y-4">
                <h4 className="font-semibold">Apply for this position</h4>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Salary Expectations (Optional)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 150000"
                    value={salaryTarget}
                    onChange={(e) => setSalaryTarget(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Letter / Notes (Optional)
                  </label>
                  <textarea
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                    placeholder="Why are you interested in this role?"
                    className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={handleApply}
                    disabled={applyMutation.isPending}
                  >
                    {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedJob(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
