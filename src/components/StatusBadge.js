import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Loader2, XCircle, AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status, label }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'running':
        return {
          icon: Loader2,
          className: 'border-transparent bg-primary/20 text-primary shadow-[0_0_10px_rgba(14,165,233,0.5)] animate-pulse',
          iconClass: 'animate-spin'
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          className: 'border-transparent bg-green-500/20 text-green-400 border-green-500/50',
          iconClass: ''
        };
      case 'failed':
        return {
          icon: XCircle,
          className: 'border-transparent bg-red-500/20 text-red-400 border-red-500/50',
          iconClass: ''
        };
      case 'skipped':
        return {
          icon: AlertCircle,
          className: 'border-transparent bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
          iconClass: ''
        };
      default:
        return {
          icon: Circle,
          className: 'border-muted bg-muted/20 text-muted-foreground',
          iconClass: ''
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider ${config.className}`} data-testid={`status-badge-${status}`}>
      <Icon className={`h-3 w-3 ${config.iconClass}`} />
      {label || status}
    </Badge>
  );
};