import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ApplicationStatus } from '@applytrack/shared';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Building2, DollarSign, MapPin, Calendar, GripVertical } from 'lucide-react';
import { formatDate, formatCurrency, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Application {
  id: string;
  company: string;
  roleTitle: string;
  status: typeof ApplicationStatus[keyof typeof ApplicationStatus];
  priority: string;
  appliedDate: string;
  location?: string;
  salaryRange?: { min: number; max: number };
  applicantName?: string;
  [key: string]: any;
}

interface KanbanColumnProps {
  status: typeof ApplicationStatus[keyof typeof ApplicationStatus];
  applications: Application[];
  title: string;
  count: number;
  color: string;
  onEdit: (app: Application) => void;
  userRole?: string;
}

interface KanbanCardProps {
  application: Application;
  onEdit: (app: Application) => void;
  userRole?: string;
}

function KanbanCard({ application, onEdit, userRole }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors: Record<string, string> = {
    high: 'destructive',
    medium: 'warning',
    low: 'secondary',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'opacity-50 z-50'
      )}
    >
      <Card
        className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/50"
        onClick={() => onEdit(application)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            {application.applicantName && userRole === 'recruiter' && (
              <p className="text-xs font-medium text-primary mb-1">
                {application.applicantName}
              </p>
            )}
            <h3 className="font-semibold text-foreground truncate">
              {application.roleTitle}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3" />
              {application.company}
            </p>
          </div>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          {application.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{application.location}</span>
            </div>
          )}
          {application.salaryRange && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>
                {formatCurrency(application.salaryRange.min)} - {formatCurrency(application.salaryRange.max)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Applied {formatDate(application.appliedDate)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Badge variant={priorityColors[application.priority] as any} className="text-xs capitalize">
            {application.priority}
          </Badge>
        </div>
      </Card>
    </div>
  );
}

function KanbanColumn({ applications, title, count, color, onEdit, userRole }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-w-[320px] max-w-[320px]">
      <div className={cn('rounded-t-lg p-3 border-b-2 bg-card', color)}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {count}
          </Badge>
        </div>
      </div>
      <div className="flex-1 bg-muted/30 rounded-b-lg p-3 min-h-[500px]">
        <SortableContext items={applications.map((a) => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Drop cards here
              </div>
            ) : (
              applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <KanbanCard application={app} onEdit={onEdit} userRole={userRole} />
                </motion.div>
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  applications: Application[];
  onStatusChange: (appId: string, newStatus: typeof ApplicationStatus[keyof typeof ApplicationStatus]) => void;
  onEdit: (app: Application) => void;
  userRole?: string;
}

export function KanbanBoard({ applications, onStatusChange, onEdit, userRole }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const allColumns: { status: typeof ApplicationStatus[keyof typeof ApplicationStatus]; title: string; color: string }[] = [
    { status: 'wishlist' as typeof ApplicationStatus[keyof typeof ApplicationStatus], title: 'Wishlist', color: 'border-gray-300' },
    { status: 'applied' as typeof ApplicationStatus[keyof typeof ApplicationStatus], title: 'Applied', color: 'border-blue-400' },
    { status: 'interview' as typeof ApplicationStatus[keyof typeof ApplicationStatus], title: 'Interview', color: 'border-purple-400' },
    { status: 'offer' as typeof ApplicationStatus[keyof typeof ApplicationStatus], title: 'Offer', color: 'border-green-400' },
    { status: 'rejected' as typeof ApplicationStatus[keyof typeof ApplicationStatus], title: 'Rejected', color: 'border-red-400' },
    { status: 'ghosted' as typeof ApplicationStatus[keyof typeof ApplicationStatus], title: 'Ghosted', color: 'border-orange-400' },
  ];

  // Filter out wishlist column for recruiters
  const columns = userRole === 'recruiter' 
    ? allColumns.filter(col => col.status !== 'wishlist')
    : allColumns;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Find which column the card was dropped in
    const activeApp = applications.find((a) => a.id === active.id);
    if (!activeApp) return;

    // Check if dropped over another application or column
    const overApp = applications.find((a) => a.id === over.id);
    const newStatus = overApp ? overApp.status : (over.data.current?.status as typeof ApplicationStatus[keyof typeof ApplicationStatus]);

    if (newStatus && activeApp.status !== newStatus) {
      onStatusChange(activeApp.id, newStatus);
    }
  };

  const activeApplication = activeId ? applications.find((a) => a.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnApps = applications.filter((a) => a.status === column.status);
          return (
            <KanbanColumn
              key={column.status}
              status={column.status}
              applications={columnApps}
              title={column.title}
              count={columnApps.length}
              color={column.color}
              onEdit={onEdit}
              userRole={userRole}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeApplication ? (
          <Card className="p-4 rotate-3 cursor-grabbing opacity-90 shadow-2xl">
            <h3 className="font-semibold">{activeApplication.roleTitle}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3" />
              {activeApplication.company}
            </p>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
