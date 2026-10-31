import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export const TATCountdownTimer = ({ ticket }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (!ticket) return;

      if (ticket.status === 'resolved' || ticket.status === 'acknowledged') {
        setTimeLeft('Resolved on time');
        setIsOverdue(false);
        return;
      }

      // Check if ticket has explicit TAT
      let targetDate;
      if (ticket.tat?.expected_by) {
        // e.g. "2026-11-05"
        targetDate = new Date(`${ticket.tat.expected_by}T23:59:59`);
      } else {
        // Calculate based on priority SLA hours
        const createdAt = new Date(ticket.created_at || Date.now());
        let slaHours = 24;
        if (ticket.priority === 'critical') slaHours = 4;
        else if (ticket.priority === 'high') slaHours = 12;
        else if (ticket.priority === 'low') slaHours = 48;

        targetDate = new Date(createdAt.getTime() + slaHours * 60 * 60 * 1000);
      }

      const now = new Date();
      const diffMs = targetDate - now;

      if (diffMs <= 0 || ticket.overdue) {
        setIsOverdue(true);
        const overdueHours = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)));
        setTimeLeft(`Overdue by ${overdueHours}h`);
      } else {
        setIsOverdue(false);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [ticket]);

  if (ticket.status === 'acknowledged' || ticket.status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
        <CheckCircle className="w-3.5 h-3.5" /> Resolved
      </span>
    );
  }

  if (isOverdue) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded-md animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
        OVERDUE ({timeLeft})
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
      ticket.priority === 'critical' ? 'bg-red-50 text-red-700 border border-red-200 font-semibold' : 'bg-slate-100 text-slate-700'
    }`}>
      {ticket.priority === 'critical' ? <Flame className="w-3.5 h-3.5 text-red-500 animate-bounce" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
      <span>{timeLeft}</span>
    </span>
  );
};

