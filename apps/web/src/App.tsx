import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ActivityPage } from './pages/ActivityPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { JobsPage } from './pages/JobsPage';
import { JobManagementPage } from './pages/JobManagementPage';
import { ProtectedLayout } from './components/layout/ProtectedLayout';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/job-postings" element={<JobManagementPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
