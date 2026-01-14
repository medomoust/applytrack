import { X } from 'lucide-react';
import { useState } from 'react';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <span className="font-semibold">🎯 Demo Mode</span>
          <div className="flex items-center gap-2">
            <span className="opacity-90">Admin:</span>
            <code className="bg-white/20 px-2 py-0.5 rounded text-xs">admin@applytrack.dev</code>
            <span className="opacity-70">/</span>
            <code className="bg-white/20 px-2 py-0.5 rounded text-xs">Password123!</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-90">User:</span>
            <code className="bg-white/20 px-2 py-0.5 rounded text-xs">demo@applytrack.dev</code>
            <span className="opacity-70">/</span>
            <code className="bg-white/20 px-2 py-0.5 rounded text-xs">Password123!</code>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
