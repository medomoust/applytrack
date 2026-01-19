import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DemoBanner } from '@/components/layout/DemoBanner';

export function ProtectedLayout() {
  const { isAuthenticated, isLoading, checkAuth, user, accessToken } = useAuthStore();

  useEffect(() => {
    // Only check auth if we have stored credentials but might need refresh
    // Don't check if already authenticated (just logged in)
    if (!isAuthenticated && (accessToken || user)) {
      checkAuth();
    }
  }, []); // Empty dependency array - only run once on mount

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DemoBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-muted p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
