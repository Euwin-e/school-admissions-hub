import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'En attente',
    className: 'status-pending',
  },
  to_validate: {
    label: 'À valider',
    className: 'status-to-validate',
  },
  validated: {
    label: 'Validé',
    className: 'status-validated',
  },
  rejected: {
    label: 'Rejeté',
    className: 'status-rejected',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === 'pending' && "bg-warning",
        status === 'to_validate' && "bg-info",
        status === 'validated' && "bg-success",
        status === 'rejected' && "bg-destructive"
      )} />
      {config.label}
    </span>
  );
}
