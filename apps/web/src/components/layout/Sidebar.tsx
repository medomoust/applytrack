import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { UserRole } from '@applytrack/shared';
import { LayoutDashboard, Activity, Users, Briefcase, Building2 } from 'lucide-react';

export function Sidebar() {
  const { user } = useAuthStore();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    // Applicant-specific links
    ...(user?.role === UserRole.APPLICANT
      ? [
          { to: '/jobs', label: 'Browse Jobs', icon: Building2 },
          { to: '/applications', label: 'My Applications', icon: Briefcase },
        ]
      : []),
    // Recruiter-specific links
    ...(user?.role === UserRole.RECRUITER
      ? [
          { to: '/job-postings', label: 'Job Postings', icon: Building2 },
          { to: '/applications', label: 'Applications', icon: Briefcase },
        ]
      : []),
    // Admin-only link
    ...(user?.isAdmin
      ? [{ to: '/admin/users', label: 'Users', icon: Users }]
      : []),
    { to: '/activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          {/* Lettermark */}
          <div className="w-7 h-7 rounded-md bg-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-primary-foreground tracking-tight">AT</span>
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">ApplyTrack</span>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'border-l-2 border-primary pl-[10px] pr-3 text-foreground font-medium bg-accent'
                    : 'px-3 text-muted-foreground hover:text-foreground hover:bg-accent/60'
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
      
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">
              {user?.name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate leading-tight">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize leading-tight mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
