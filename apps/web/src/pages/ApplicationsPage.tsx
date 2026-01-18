import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { ApplicationStatus, Priority, UserRole } from '@applytrack/shared';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { KanbanBoard } from '@/components/applications/KanbanBoard';
import { ApplicationModal } from '@/components/applications/ApplicationModal';
import { formatDate } from '@/lib/utils';
import { 
  LayoutGrid, 
  Table as TableIcon, 
  Search, 
  Filter,
  Archive,
  Trash2,
  Edit,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'kanban' | 'table';

export function ApplicationsPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState({
    search: '',
    status: undefined as typeof ApplicationStatus[keyof typeof ApplicationStatus] | undefined,
    priority: undefined as typeof Priority[keyof typeof Priority] | undefined,
    archived: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<any>(null);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['applications', page, filters],
    queryFn: () => apiClient.getApplications({ page, pageSize: 100, ...filters }),
    retry: 1,
    staleTime: 0, // Always refetch to ensure fresh data
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: typeof ApplicationStatus[keyof typeof ApplicationStatus] }) =>
      apiClient.updateApplication(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => apiClient.archiveApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application archived');
    },
    onError: () => {
      toast.error('Failed to archive application');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application deleted');
    },
    onError: () => {
      toast.error('Failed to delete application');
    },
  });



  const handleEdit = (app: any) => {
    setEditingApplication(app);
    setIsModalOpen(true);
  };

  const handleStatusChange = (appId: string, newStatus: typeof ApplicationStatus[keyof typeof ApplicationStatus]) => {
    updateStatusMutation.mutate({ id: appId, status: newStatus });
  };

  const statusColors: Record<string, any> = {
    wishlist: 'secondary',
    applied: 'default',
    interview: 'warning',
    offer: 'success',
    rejected: 'destructive',
    ghosted: 'outline',
  };

  const applications = data?.data || [];
  
  console.log('📱 Frontend Applications:', {
    dataExists: !!data,
    totalApps: applications.length,
    companies: [...new Set(applications.map((a: any) => a.company))],
    filters,
    isLoading,
    isError,
  });
  
  const filteredApplications = applications.filter((app: any) => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch = 
        (app.company?.toLowerCase() || '').includes(search) ||
        (app.roleTitle?.toLowerCase() || '').includes(search);
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (filters.status && app.status !== filters.status) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && app.priority !== filters.priority) {
      return false;
    }
    
    return true;
  });

  const clearFilters = () => {
    setFilters({
      search: '',
      status: undefined,
      priority: undefined,
      archived: false,
    });
  };

  const activeFilterCount = [
    filters.status,
    filters.priority,
  ].filter(Boolean).length;

  // Show error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Applications
          </h1>
        </div>
        <Card className="p-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-destructive mb-2">Failed to load applications</p>
            <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </Card>
      </div>
    );
  }

  // Add defensive check
  if (!data && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Applications
          </h1>
        </div>
        <Card className="p-8">
          <EmptyState
            icon={FileText}
            title="No data available"
            description="Unable to load applications. Please try refreshing the page."
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
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Applications
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === UserRole.APPLICANT
            ? 'Track and manage your job applications'
            : 'View and manage applications to your company\'s jobs'}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {(() => {
          const stats = [
            { label: 'Total', count: applications.length, color: 'blue' },
            { label: 'Applied', count: applications.filter((a: any) => a.status === 'applied').length, color: 'green' },
            { label: 'Interviews', count: applications.filter((a: any) => a.status === 'interview').length, color: 'purple' },
            { label: 'Offers', count: applications.filter((a: any) => a.status === 'offer').length, color: 'yellow' },
          ];
          
          // Add wishlist stat for applicants only
          if (user?.role === 'applicant') {
            stats.splice(1, 0, { 
              label: 'Wishlist', 
              count: applications.filter((a: any) => a.status === 'wishlist').length, 
              color: 'gray' 
            });
          }
          
          return stats.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.count}</p>
                </div>
              </div>
            </Card>
          ));
        })()}
      </motion.div>

      {/* Filters & View Toggle */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search company or role..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 relative">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="default" className="ml-1 px-1.5 py-0 h-5 min-w-5 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filter Applications</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Status</label>
                    <div className="space-y-2">
                      {Object.entries(ApplicationStatus).map(([_, value]) => (
                        <button
                          key={value}
                          onClick={() => setFilters({ 
                            ...filters, 
                            status: filters.status === value ? undefined : value 
                          })}
                          className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                            filters.status === value
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'hover:bg-muted border-border'
                          }`}
                        >
                          <Badge variant={filters.status === value ? 'secondary' : 'outline'} className="capitalize">
                            {value}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Priority</label>
                    <div className="space-y-2">
                      {Object.entries(Priority).map(([_, value]) => (
                        <button
                          key={value}
                          onClick={() => setFilters({ 
                            ...filters, 
                            priority: filters.priority === value ? undefined : value 
                          })}
                          className={`w-full text-left px-3 py-2 rounded-md border transition-colors ${
                            filters.priority === value
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'hover:bg-muted border-border'
                          }`}
                        >
                          <Badge variant={filters.priority === value ? 'secondary' : 'outline'} className="capitalize">
                            {value}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFilterCount > 0 && (
                    <Button 
                      variant="outline" 
                      className="w-full gap-2" 
                      onClick={clearFilters}
                    >
                      <X className="h-4 w-4" />
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-2">
                <TableIcon className="h-4 w-4" />
                Table
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={FileText}
            title={applications.length === 0 ? "No applications yet" : "No matching applications"}
            description={
              applications.length === 0
                ? (user?.role === UserRole.APPLICANT
                    ? 'Browse available jobs and apply to start tracking your applications'
                    : 'Applications to your company\'s job postings will appear here')
                : 'Try adjusting your filters to see more results'
            }
          />
        </Card>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <KanbanBoard
                applications={filteredApplications as any}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                userRole={user?.role}
              />
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr className="text-left">
                        {user?.role === 'recruiter' && <th className="p-4 font-semibold">Applicant</th>}
                        <th className="p-4 font-semibold">Company</th>
                        <th className="p-4 font-semibold">Role</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Priority</th>
                        <th className="p-4 font-semibold">Applied</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((app: any) => (
                        <motion.tr
                          key={app.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          {user?.role === 'recruiter' && (
                            <td className="p-4 font-medium text-primary">
                              {app.applicantName || 'N/A'}
                            </td>
                          )}
                          <td className="p-4 font-medium">{app.company}</td>
                          <td className="p-4">{app.roleTitle}</td>
                          <td className="p-4">
                            <Badge variant={statusColors[app.status]}>
                              {app.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="capitalize">
                              {app.priority}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDate(app.appliedDate)}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(app)}
                                className="gap-1"
                              >
                                <Edit className="h-3 w-3" />
                                Edit
                              </Button>
                              {!app.archived ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => archiveMutation.mutate(app.id)}
                                  className="gap-1"
                                >
                                  <Archive className="h-3 w-3" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteMutation.mutate(app.id)}
                                  className="gap-1 text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {isModalOpen && (
        <ApplicationModal
          application={editingApplication}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['applications'] });
          }}
        />
      )}
    </div>
  );
}
