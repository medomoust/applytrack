import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Search, Plus, Briefcase, MapPin, Edit, Trash, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  WORK_MODES,
  EMPLOYMENT_TYPES,
} from '@applytrack/shared';

export function JobManagementPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<{
    roleTitle: string;
    location: string;
    workMode: string;
    employmentType: string;
    description: string;
    requirements: string;
    salaryRange: string;
  }>({
    roleTitle: '',
    location: '',
    workMode: 'office',
    employmentType: 'full-time',
    description: '',
    requirements: '',
    salaryRange: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['job-postings', search],
    queryFn: () => apiClient.getJobPostings({ search, pageSize: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: apiClient.createJobPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast.success('Job posting created successfully!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create job posting');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient.updateJobPosting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast.success('Job posting updated successfully!');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update job posting');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiClient.deleteJobPosting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast.success('Job posting deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete job posting');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'open' | 'closed' }) =>
      apiClient.updateJobPosting(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      toast.success('Job posting status updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update status');
    },
  });

  const handleOpenDialog = (job?: any) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        roleTitle: job.roleTitle,
        location: job.location || '',
        workMode: job.workMode,
        employmentType: job.employmentType,
        description: job.description || '',
        requirements: job.requirements || '',
        salaryRange: job.salaryRange || '',
      });
    } else {
      setEditingJob(null);
      setFormData({
        roleTitle: '',
        location: '',
        workMode: 'office',
        employmentType: 'full-time',
        description: '',
        requirements: '',
        salaryRange: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingJob(null);
    setFormData({
      roleTitle: '',
      location: '',
      workMode: 'office',
      employmentType: 'full-time',
      description: '',
      requirements: '',
      salaryRange: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.roleTitle.trim()) {
      toast.error('Role title is required');
      return;
    }

    const submitData: any = {
      ...formData,
      company: user!.company!,
      location: formData.location || undefined,
      description: formData.description || undefined,
      requirements: formData.requirements || undefined,
      salaryRange: formData.salaryRange || undefined,
    };

    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleToggleStatus = (job: any) => {
    const newStatus: 'open' | 'closed' = job.status === 'open' ? 'closed' : 'open';
    toggleStatusMutation.mutate({ id: job.id, status: newStatus });
  };

  const handleDelete = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      deleteMutation.mutate(jobId);
    }
  };

  const jobs = data?.data || [];

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
            <Briefcase className="h-8 w-8 text-primary" />
            Job Postings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's open positions
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Posting
        </Button>
      </motion.div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job postings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job postings yet"
          description="Create your first job posting to start receiving applications"
          action={
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Posting
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{job.roleTitle}</h3>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                        {job.status === 'open' ? 'Open' : 'Closed'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {job.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">{job.workMode}</Badge>
                        <Badge variant="outline" className="capitalize">{job.employmentType}</Badge>
                      </div>
                      {job.salaryRange && (
                        <p className="text-sm font-medium text-primary">{job.salaryRange}</p>
                      )}
                    </div>

                    {job.description && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <span>Created {new Date(job.createdAt).toLocaleDateString()}</span>
                      {job._count?.applications !== undefined && (
                        <>
                          <span>•</span>
                          <span>{job._count.applications} application{job._count.applications !== 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(job)}
                      className="gap-2"
                    >
                      {job.status === 'open' ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          Close
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Reopen
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(job)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(job.id)}
                      className="gap-2"
                    >
                      <Trash className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Role Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.roleTitle}
                onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Work Mode</label>
                <Select
                  value={formData.workMode}
                  onValueChange={(value) => setFormData({ ...formData, workMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode} className="capitalize">
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Employment Type</label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => setFormData({ ...formData, employmentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salary Range</label>
              <Input
                value={formData.salaryRange}
                onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                placeholder="e.g., $120k - $180k"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and responsibilities..."
                className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Requirements</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="List the required skills and qualifications..."
                className="w-full min-h-[120px] px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending)
                  ? 'Saving...'
                  : editingJob
                  ? 'Update Posting'
                  : 'Create Posting'}
              </Button>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
