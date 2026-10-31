import React from 'react';
import { AlertTriangle, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export const PriorityBadge = ({ priority = 'medium', size = 'normal', showIcon = true }) => {
  const p = priority?.toLowerCase() || 'medium';

  const configs = {
    critical: {
      bg: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
      dot: 'bg-red-500 animate-ping',
      label: 'CRITICAL',
      icon: AlertTriangle,
      glow: 'shadow-sm shadow-red-200 ring-1 ring-red-400',
    },
    high: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'HIGH',
      icon: AlertCircle,
      glow: '',
    },
    medium: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      label: 'MEDIUM',
      icon: Clock,
      glow: '',
    },
    low: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'LOW',
      icon: CheckCircle2,
      glow: '',
    },
  };

  const config = configs[p] || configs.medium;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.glow} ${sizeClasses}`}>
      <span className="relative flex h-2 w-2">
        {p === 'critical' && (
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${p === 'critical' ? 'bg-red-600' : config.dot}`} />
      </span>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </span>
  );
};

export const StatusBadge = ({ status = 'open' }) => {
  const s = status?.toLowerCase() || 'open';

  if (s === 'resolved') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
        Resolved
      </span>
    );
  }

  if (s === 'acknowledged') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5" />
        Acknowledged (Closed)
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
      Open
    </span>
  );
};

