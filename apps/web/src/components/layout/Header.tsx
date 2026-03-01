import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth';
import { useThemeStore } from '@/lib/theme';
import { Button } from '@/components/ui/Button';
import { Moon, Sun, LogOut, Search } from 'lucide-react';
import { useState } from 'react';
import { CommandPalette } from '@/components/ui/CommandPalette';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/applications': 'Applications',
  '/activity': 'Activity',
  '/admin/users': 'Admin › Users',
};

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleLogout = async () => {
    // Clear all cached data on logout
    queryClient.clear();
    await logout();
    navigate('/login');
  };

  const breadcrumb = breadcrumbMap[location.pathname] || 'Dashboard';

  return (
    <>
      <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex-1">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{breadcrumb}</h2>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="h-8 gap-2 rounded-full px-3 text-xs text-muted-foreground border-border"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[10px] font-medium">
              ⌘K
            </kbd>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Logout</span>
          </Button>
        </div>
      </header>
      
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  );
}

