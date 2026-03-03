import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type EventType = 'created' | 'updated' | 'status_changed' | 'archived' | 'restored' | 'note_added';

interface EventConfig {
  icon: string;
  color: string;
  bgColor: string;
  label: string;
}

export function ActivityPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['activity', page],
    queryFn: () => apiClient.getActivity({ page, pageSize: 20 }),
    retry: 1,
  });

  const eventConfig: Record<EventType, EventConfig> = {
    created: {
      icon: 'M12 4v16m8-8H4',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      label: 'Created',
    },
    updated: {
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      label: 'Updated',
    },
    status_changed: {
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      label: 'Status Changed',
    },
    archived: {
      icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      label: 'Archived',
    },
    restored: {
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: 'Restored',
    },
    note_added: {
      icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      label: 'Note Added',
    },
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getEventConfig = (eventType: string): EventConfig => {
    return eventConfig[eventType as EventType] || {
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      label: 'Activity',
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Activity</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track all changes to your applications</p>
      </div>

      {isError ? (
        <Card className="border-red-100 bg-red-50/50">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-900">Unable to load activity</p>
                <p className="text-xs text-red-700">{error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Activity Timeline */}
          <div className="relative">
            {!data?.data.length ? (
              <Card className="border-dashed">
                <CardContent className="p-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No activity yet</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Your activity will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-1">
                {data.data.map((log: any, index: number) => {
                  const config = getEventConfig(log.eventType);
                  return (
                    <div
                      key={log.id}
                      className="group relative flex gap-4 p-4 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Timeline line */}
                      {index !== data.data.length - 1 && (
                        <div className="absolute left-[26px] top-[48px] bottom-[-4px] w-px bg-gray-200 dark:bg-gray-700"></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`relative flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-950`}>
                        <svg className={`w-5 h-5 ${config.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
                              {log.description}
                            </p>
                            {log.jobApplication && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">
                                {log.jobApplication.roleTitle} · {log.jobApplication.company}
                              </p>
                            )}
                          </div>
                          <time className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {formatTimeAgo(log.createdAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Page {page} of {data.pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="text-xs"
                >
                  ← Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="text-xs"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
