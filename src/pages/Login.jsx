import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  QrCode,
  ArrowRight,
  KeyRound,
  Mail,
  AlertCircle,
  Zap
} from 'lucide-react';

export const Login = ({ onOpenQRScanner }) => {
  const { loginUser, loginAdmin, quickLoginAs } = useAuth();
  const [role, setRole] = useState('student'); // 'student' | 'maintenance' | 'admin'
  const [email, setEmail] = useState('mahesh@gmail.com');
  const [otp, setOtp] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'student') {
      setEmail('mahesh@gmail.com');
      setOtp('123456');
    } else if (selectedRole === 'maintenance') {
      setEmail('kumar.staff@gmail.com');
      setOtp('730792');
    } else if (selectedRole === 'admin') {
      setEmail('admin@team29.com');
      setOtp('004712');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'admin') {
        const cleanEmail = email.trim().toLowerCase();
        const cleanOtp = otp.trim();
        if (cleanEmail !== 'admin@team29.com' || cleanOtp !== '004712') {
          setError('Sirf admin@team29.com aur OTP 004712 ko Admin panel use karne ki authorization hai.');
          setLoading(false);
          return;
        }
        await loginAdmin(cleanEmail, cleanOtp);
      } else {
        const cleanEmail = email.trim().toLowerCase();
        if (cleanEmail === 'admin@team29.com') {
          setError('admin@team29.com sirf Admin ke liye reserved hai. Kripya Admin role select karein.');
          setLoading(false);
          return;
        }
        await loginUser(cleanEmail, otp.trim(), role);
      }
    } catch (err) {
      if (err.error?.code === 'USE_ADMIN_LOGIN') {
        setError(err.error.message || 'admin@team29.com sirf Admin ke liye hai. Kripya Admin role select karein.');
      } else if (err.error?.code === 'INVALID_CREDENTIALS') {
        setError(err.error.message || 'Wrong email address or OTP.');
      } else {
        setError(err.message || 'Login failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 bg-slate-100">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Branding Panel (Wireframe Page 1) */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight">FixIt<span className="text-blue-500">.</span></span>
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
              CAMPUS MAINTENANCE PORTAL
            </span>

            <h2 className="text-2xl font-black mt-4 leading-tight">
              Report, track, and fix campus issues.
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Empowering students, faculty, maintenance crews and administration with smart QR reporting, automated priority detection, and before/after verification.
            </p>
          </div>

          {/* Innovation Highlight Slogan Box */}
          <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Smart Innovation</span>
            </div>
            <p className="text-[11px] text-slate-300">
              <strong>"Scan it. Report it. Fix it."</strong><br />
              Don't want to log in? Scan classroom QR tags to file a hazard report in 5 seconds.
            </p>
            <button
              onClick={onOpenQRScanner}
              className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <QrCode className="w-4 h-4" />
              <span>Direct QR Report (No Login Needed)</span>
            </button>
          </div>

          <div className="text-[10px] text-slate-500 pt-4">
            CampusOS Maintenance Ticket System · v2.0
          </div>
        </div>

        {/* Right Form Panel (Wireframe Page 1) */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Welcome</h3>
            <p className="text-xs text-slate-500 mt-1">Login to your account</p>
          </div>

          {/* Role Selector Tabs (Wireframe Page 1: Select Role) */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Role:
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${role === 'student'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('maintenance')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${role === 'maintenance'
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${role === 'admin'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Role specific guidance banner */}
          <div className="mb-4">
            {role === 'admin' ? (
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-bold">🔒 Restricted Administrator Access</strong>
                  <span className="text-[11px] text-purple-700">Sirf authorized admin credentials se login kar sakte hain.</span>
                </div>
              </div>
            ) : role === 'maintenance' ? (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-bold">🛠️ Maintenance Staff Login</strong>
                  <span className="text-[11px] text-amber-700">Staff apna Gmail ya college email enter karke login kar sakte hain.</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="block font-bold">🎓 Student Login</strong>
                  <span className="text-[11px] text-blue-700">Students apna Gmail ya college email enter karke login kar sakte hain.</span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'admin' ? 'Admin Email ID (Strictly admin@team29.com):' : 'Email Address / Gmail:'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === 'admin'
                      ? 'admin@team29.com'
                      : role === 'maintenance'
                        ? 'e.g. kumar.staff@gmail.com'
                        : 'e.g. mahesh@gmail.com'
                  }
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>{role === 'admin' ? 'Admin Secret OTP:' : 'One-Time Password (OTP):'}</span>
                {role !== 'admin' && (
                  <span className="text-[10px] text-blue-600 font-semibold">
                    Demo: {otp || '123456'}
                  </span>
                )}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={role === 'admin' ? '004712' : '6-digit OTP'}
                  className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest font-bold"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : `Login as ${role === 'admin' ? 'Administrator' : role === 'maintenance' ? 'Staff' : 'Student'}`}
            </button>
          </form>

          {/* 1-Click Fast Persona Buttons for Evaluators */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              ⚡ Evaluator 1-Click Fast Login
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLoginAs('student')}
                className="py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200 transition-colors"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => quickLoginAs('maintenance')}
                className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200 transition-colors"
              >
                🛠️ Staff
              </button>
              <button
                type="button"
                onClick={() => quickLoginAs('admin')}
                className="py-1.5 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[10px] border border-purple-200 transition-colors"
                title="Admin quick login"
              >
                🔐 Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

