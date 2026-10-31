import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  Users,
  FolderTree,
  BarChart3,
  LogOut,
  PlusCircle,
  QrCode,
  User,
  Clock,
  Layers,
  MapPin,
  ClipboardList
} from 'lucide-react';

export const Sidebar = ({ activeTab, onSelectTab, counts = {} }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const role = user.role;
  const isMaintenance = role === 'office_staff' && user.dept?.toLowerCase().includes('maintenance');
  const isAdmin = role === 'admin';
  const isStudent = role === 'student';

  // Navigation Items per role
  let navItems = [];

  if (isAdmin) {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'tickets', label: 'All Tickets', icon: Ticket, count: counts.tickets },
      { id: 'users', label: 'Users', icon: Users, count: counts.users },
      { id: 'issue-types', label: 'Issue Types', icon: FolderTree },
      { id: 'heatmap', label: 'Campus Heatmap', icon: Layers },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    ];
  } else if (isMaintenance) {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'tickets', label: 'All Tickets', icon: Ticket, count: counts.tickets },
      { id: 'progress', label: 'Progress Notes', icon: ClipboardList },
      { id: 'issue-types', label: 'Issue Types', icon: FolderTree },
      { id: 'tat', label: 'Turnaround Time', icon: Clock },
      { id: 'qr-codes', label: 'QR Code Management', icon: QrCode },
      { id: 'heatmap', label: 'Campus Heatmap', icon: Layers },
    ];
  } else {
    // Student
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'raise-ticket', label: 'Raise a Ticket', icon: PlusCircle, highlight: true },
      { id: 'my-tickets', label: 'My Tickets', icon: Ticket, count: counts.myTickets },
      { id: 'qr-report', label: 'QR Report', icon: QrCode },
      { id: 'profile', label: 'My Profile', icon: User },
    ];
  }

  const roleTitles = {
    admin: { header: 'ADMINISTRATION', sub: 'SYSTEM CONTROL' },
    office_staff: { header: 'CAMPUS MAINTENANCE', sub: 'WORKSPACE' },
    student: { header: 'CAMPUS MAINTENANCE PORTAL', sub: 'STUDENT DESK' }
  };

  const currentRoleTitle = roleTitles[role] || roleTitles.student;

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-[calc(100vh-65px)] flex flex-col justify-between p-4 border-r border-slate-800">
      <div>
        {/* Brand & Section Title */}
        <div className="px-3 py-3 border-b border-slate-800/80 mb-4">
          <div className="text-xl font-black text-white tracking-wider flex items-center gap-1">
            FixIt<span className="text-blue-500">.</span>
          </div>
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-1">
            {currentRoleTitle.header}
          </div>
          <div className="text-[9px] uppercase tracking-wider text-blue-400 font-bold mt-0.5">
            {currentRoleTitle.sub}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : item.highlight
                    ? 'text-blue-400 hover:bg-slate-900 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count !== null && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
        <div className="px-3.5 mt-3 text-[10px] text-slate-500">
          FixIt · CampusOS v1.0
        </div>
      </div>
    </aside>
  );
};

