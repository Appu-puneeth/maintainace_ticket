import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  QrCode,
  LogOut,
  Settings,
  Bell,
  CheckCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

export const Navbar = ({ onOpenQRScanner, onOpenScenario, onOpenSettings, onOpenComplaintQR }) => {
  const { user, logout, quickLoginAs, isLiveApiConnected, apiUrl } = useAuth();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return { label: 'Administrator', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: ShieldCheck };
    }
    if (role === 'office_staff') {
      return { label: 'Maintenance Staff', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: UserCheck };
    }
    return { label: 'Student Portal', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: GraduationCap };
  };

  const badge = user ? getRoleBadge(user.role) : null;
  const BadgeIcon = badge?.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">FixIt<span className="text-blue-600">.</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  SMART v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Campus Maintenance System</p>
            </div>
          </div>

          {/* Live API / Demo status badge */}
          <div
            onClick={onOpenSettings}
            className="cursor-pointer ml-2 hidden md:flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-slate-50 hover:bg-slate-100 transition-colors"
            title="Click to configure CampusOS API base URL"
          >
            {isLiveApiConnected ? (
              <>
                <Wifi className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-700">Live CampusOS API</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-slate-600">Smart Local Sandbox</span>
              </>
            )}
          </div>
        </div>

        {/* Center / Fast Actions */}
        <div className="flex items-center gap-2">
          {/* Direct Complaint QR Generator Button */}
          <button
            onClick={onOpenComplaintQR}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm transition-all"
            title="Generate Direct Student Complaint QR"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Complaint QR</span>
          </button>

          {/* Quick Scenario Simulator Button */}
          <button
            onClick={onOpenScenario}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Classroom 203 Scenario</span>
          </button>

          {/* Quick QR Scan Action */}
          <button
            onClick={onOpenQRScanner}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        </div>

        {/* Right / Persona Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Persona Switcher Quick Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border ${badge.color} transition-all`}
                  title="Switch Persona"
                >
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{badge.label}</span>
                  <span className="text-[10px] opacity-70">▼</span>
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Switch Role View
                    </div>
                    <button
                      onClick={() => { quickLoginAs('student'); setShowRoleDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 rounded-xl flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-semibold">Student Portal</div>
                        <div className="text-[10px] text-slate-400">Mahesh (CSE)</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { quickLoginAs('maintenance'); setShowRoleDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-semibold">Maintenance Staff</div>
                        <div className="text-[10px] text-slate-400">Kumar Gowda (Supervisor)</div>
                      </div>
                    </button>
                    <button
                      onClick={() => { quickLoginAs('admin'); setShowRoleDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-purple-50 rounded-xl flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-semibold">Administrator</div>
                        <div className="text-[10px] text-slate-400">Restricted Access</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500">{user.email_id}</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => quickLoginAs('student')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5"
              >
                Student Demo
              </button>
              <button
                onClick={() => quickLoginAs('maintenance')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 px-3 py-1.5"
              >
                Maintenance Demo
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

