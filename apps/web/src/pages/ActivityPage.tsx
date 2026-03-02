import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function ActivityPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['activity', page],
    queryFn: () => apiClient.getActivity({ page, pageSize: 20 }),
    retry: 1,
  });

  const eventTypeIcons: Record<string, string> = {
    created: '➕',
    updated: '✏️',
    status_changed: '🔄',
    archived: '📦',
    restored: '♻️',
    note_added: '📝',
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">History</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Activity Log</h1>
        <p className="text-zinc-500">Track all changes to your applications</p>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-lg font-semibold text-destructive mb-2">Failed to load activity</p>
              <p className="text-muted-foreground mb-4">{error instanceof Error ? error.message : 'Unknown error'}</p>
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <Card>
            <CardContent className="p-6">
              {!data?.data.length ? (
                <p className="text-center text-muted-foreground py-8">No activity yet</p>
              ) : (
                <div className="space-y-4">
                  {data.data.map((log: any) => (
                    <div key={log.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0 text-2xl">{eventTypeIcons[log.eventType] || '•'}</div>
                      <div className="flex-1">
                        <p className="font-medium">{log.description}</p>
                        {log.jobApplication && (
                          <p className="text-sm text-muted-foreground">
                            {log.jobApplication.roleTitle} at {log.jobApplication.company}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm">
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
        </>
      )}
    </div>
  );
}
