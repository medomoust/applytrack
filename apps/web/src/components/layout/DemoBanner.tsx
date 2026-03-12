import { X } from 'lucide-react';
import { useState } from 'react';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-slate-900 dark:bg-slate-950 border-b border-slate-800 text-slate-300 px-4 py-2">
      <div className="flex items-center justify-center gap-6 text-xs">
        <span className="text-slate-500 uppercase tracking-widest font-medium text-[10px]">Demo</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Recruiter</span>
          <code className="text-slate-200 font-mono">recruiter@meta.com</code>
          <span className="text-slate-600">·</span>
          <code className="text-slate-200 font-mono">Password123!</code>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-slate-500">Applicant</span>
          <code className="text-slate-200 font-mono">john.doe@email.com</code>
          <span className="text-slate-600">·</span>
          <code className="text-slate-200 font-mono">Password123!</code>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
