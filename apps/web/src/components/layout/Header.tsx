import { useNavigate, useLocation } from 'react-router-dom';
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
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const breadcrumb = breadcrumbMap[location.pathname] || 'Dashboard';

  return (
    <>
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-sm bg-background/95">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">{breadcrumb}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>
      
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  );
}

