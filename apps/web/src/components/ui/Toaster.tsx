import { Toaster as Sonner } from 'sonner';
import { useThemeStore } from '@/lib/theme';

export function Toaster() {
  const { theme } = useThemeStore();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'border border-border bg-card text-foreground',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
    />
  );
}
