import React, { useState, useEffect } from 'react';
import {
  Users,
  Ticket,
  FolderTree,
  BarChart3,
  Plus,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Search,
  KeyRound,
  UserCheck,
  GraduationCap,
  Building2,
  Layers,
  ChevronRight,
  Edit3,
  Download,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, downloadPhoto } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/PriorityBadge';
import { TATCountdownTimer } from '../components/TATCountdownTimer';
import { CampusHeatmap } from '../components/CampusHeatmap';

export const AdminDashboard = ({ activeTab, onSelectTab, onViewTicket }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpAlert, setOtpAlert] = useState(null);

  // User management state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    role: 'student',
    name: '',
    email_id: '',
    phone_number: '',
    usn: '',
    dept: 'CSE',
    designation: '',
  });

  // Edit User state
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserData, setEditUserData] = useState(null);

  const handleStartEditUser = (userToEdit) => {
    setEditUserData({
      email_id: userToEdit.email_id,
      name: userToEdit.name || '',
      role: userToEdit.role || 'student',
      dept: userToEdit.dept || 'CSE',
      phone_number: userToEdit.phone_number || '',
      usn: userToEdit.usn || '',
      designation: userToEdit.designation || '',
    });
    setShowEditUserModal(true);
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editUserData?.email_id) return;
    try {
      await api.updateUser(editUserData.email_id, editUserData);
      setOtpAlert(`User ${editUserData.name} updated successfully!`);
      setShowEditUserModal(false);
      setEditUserData(null);
      loadData();
    } catch {
      alert('Failed to update user');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, tRes, itRes] = await Promise.all([
        api.listUsers(),
        api.getTickets(),
        api.getIssueTypes(),
      ]);
      setUsers(uRes.items || []);
      setTickets(tRes.items || []);
      setIssueTypes(itRes.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email_id || !newUser.phone_number) return;

    try {
      const created = await api.createUser(newUser);
      setOtpAlert(`User ${created.name} registered successfully! Login OTP is: ${created.otp}`);
      setShowAddUserModal(false);
      setNewUser({
        role: 'student',
        name: '',
        email_id: '',
        phone_number: '',
        usn: '',
        dept: 'CSE',
        designation: '',
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  const handleRegenerateOtp = async (email) => {
    try {
      const res = await api.regenerateOtp(email);
      setOtpAlert(`New OTP generated for ${email}: ${res.otp}`);
      loadData();
    } catch (err) {
      alert('Could not regenerate OTP');
    }
  };

  const handleDeleteUser = async (email) => {
    if (!confirm(`Delete user account ${email}?`)) return;
    await api.deleteUser(email);
    loadData();
  };

  const handleDeleteTicket = async (id) => {
    if (!confirm('Administratively delete this ticket?')) return;
    await api.deleteTicket(id);
    loadData();
  };

  // Metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'acknowledged').length;
  const totalUsers = users.length + 1; // including admin

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD VIEW (PDF 2 Page 1-2 & Wireframe Page 8) */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                🔐 Administrator Control Center
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-3">Welcome, Admin 👋</h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                Monitor maintenance requests, track ticket progress across all blocks, configure staff roles and manage accounts across your campus from one central panel.
              </p>
            </div>
          </div>

          {/* Metric Cards (PDF 2 Page 1) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Total Tickets</span>
              <div className="text-3xl font-black text-slate-900 mt-2">{totalTickets}</div>
              <span className="text-[11px] text-slate-400">All reported requests</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-amber-600 font-semibold block">Open Tickets</span>
              <div className="text-3xl font-black text-amber-500 mt-2">{openTickets}</div>
              <span className="text-[11px] text-slate-400">Needs attention</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-emerald-600 font-semibold block">Resolved Tickets</span>
              <div className="text-3xl font-black text-emerald-600 mt-2">{resolvedTickets}</div>
              <span className="text-[11px] text-slate-400">Successfully completed</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-indigo-600 font-semibold block">Registered Users</span>
              <div className="text-3xl font-black text-indigo-600 mt-2">{totalUsers}</div>
              <span className="text-[11px] text-slate-400">Students & staff</span>
            </div>
          </div>

          {/* Quick Administration Cards (PDF 2 Page 1) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Administration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => onSelectTab('tickets')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">🎫</div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600">All Tickets</h4>
                <p className="text-xs text-slate-500 mt-1">
                  View and monitor maintenance tickets raised across the campus.
                </p>
                <button className="mt-4 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-xl">
                  View Tickets
                </button>
              </div>

              <div
                onClick={() => onSelectTab('users')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">👥</div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600">User Overview</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Review and register student, staff and maintenance accounts.
                </p>
                <button className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-xl">
                  View Users
                </button>
              </div>

              <div
                onClick={() => onSelectTab('issue-types')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">🗂️</div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600">Issue Types</h4>
                <p className="text-xs text-slate-500 mt-1">
                  View and organize maintenance categories available in the portal.
                </p>
                <button className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-xl">
                  View Types
                </button>
              </div>
            </div>
          </div>

          {/* CAMPUS HEATMAP PREVIEW */}
          <CampusHeatmap />

          {/* Recent Tickets Table (PDF 2 Page 2) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Tickets</h3>
                <p className="text-xs text-slate-400">Campus maintenance overview</p>
              </div>
              <button
                onClick={() => onSelectTab('tickets')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Ticket ID</th>
                    <th className="px-6 py-3.5">Issue</th>
                    <th className="px-6 py-3.5">Reporter</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tickets.slice(0, 5).map((t) => (
                    <tr key={t.ticket_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">{t.custom_id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{t.title}</td>
                      <td className="px-6 py-4 text-slate-600">{t.reported_by_name}</td>
                      <td className="px-6 py-4 text-slate-500">{t.location}</td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={t.priority} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onViewTicket(t)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. USER MANAGEMENT VIEW (Wireframe Page 8 & PDF 1 Section 3) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">User Management</h2>
              <p className="text-xs text-slate-500">Manage student, faculty and campus maintenance accounts</p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>[+ ADD User]</span>
            </button>
          </div>

          {/* OTP Alert */}
          {otpAlert && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 text-xs">
                <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-semibold">{otpAlert}</span>
              </div>
              <button onClick={() => setOtpAlert(null)} className="text-xs text-indigo-600 hover:underline">
                Dismiss
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Department / Details</th>
                  <th className="px-5 py-3">Email ID</th>
                  <th className="px-5 py-3">Login OTP</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.email_id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {u.dept || u.designation || 'General'} {u.usn ? `(${u.usn})` : ''}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600">{u.email_id}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                        {u.otp}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleStartEditUser(u)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit User Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRegenerateOtp(u.email_id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Regenerate OTP"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.email_id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ALL TICKETS ADMINISTRATIVE MANAGEMENT */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">Campus Maintenance Tickets (Master List)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <div key={t.ticket_id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">{t.custom_id}</span>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={t.priority} size="sm" />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-slate-800">{t.title}</h4>
                <p className="text-xs text-slate-500">{t.location} · {t.reported_by_name}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewTicket(t)}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View Details
                    </button>
                    {(t.before_photo || t.photo?.url) && (
                      <button
                        type="button"
                        onClick={() => downloadPhoto(t.before_photo || t.photo?.url, `Ticket_${t.custom_id || t.ticket_id}.jpg`)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-lg transition-colors"
                        title="Download photo"
                      >
                        <Download className="w-3 h-3" />
                        <span>Photo</span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTicket(t.ticket_id)}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Delete Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Register New Campus User</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Role:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="student">Student</option>
                  <option value="office_staff">Office Staff (Campus Maintenance)</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Asha Kumar"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email ID (@team1.com):</label>
                <input
                  type="email"
                  placeholder="e.g. asha@team1.com"
                  value={newUser.email_id}
                  onChange={(e) => setNewUser({ ...newUser, email_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={newUser.phone_number}
                  onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              {newUser.role === 'student' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">USN (uppercase):</label>
                    <input
                      type="text"
                      placeholder="1CF24CS001"
                      value={newUser.usn}
                      onChange={(e) => setNewUser({ ...newUser, usn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department:</label>
                    <select
                      value={newUser.dept}
                      onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ISE">ISE</option>
                      <option value="ECE">ECE</option>
                      <option value="MBA">MBA</option>
                    </select>
                  </div>
                </>
              )}

              {newUser.role === 'office_staff' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department:</label>
                    <input
                      type="text"
                      value={newUser.dept}
                      onChange={(e) => setNewUser({ ...newUser, dept: e.target.value })}
                      placeholder="Campus Maintenance"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designation:</label>
                    <input
                      type="text"
                      value={newUser.designation}
                      onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                      placeholder="Supervisor / Electrician"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit User Modal (Student & Staff Edit Option) */}
      {showEditUserModal && editUserData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Edit User Details ({editUserData.role})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditUserModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email ID (Identifier):</label>
                <input
                  type="email"
                  value={editUserData.email_id}
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                <input
                  type="tel"
                  value={editUserData.phone_number}
                  onChange={(e) => setEditUserData({ ...editUserData, phone_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              {editUserData.role === 'student' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">University USN:</label>
                    <input
                      type="text"
                      value={editUserData.usn}
                      onChange={(e) => setEditUserData({ ...editUserData, usn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department:</label>
                    <select
                      value={editUserData.dept}
                      onChange={(e) => setEditUserData({ ...editUserData, dept: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="CSE">CSE</option>
                      <option value="ISE">ISE</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="MBA">MBA</option>
                    </select>
                  </div>
                </>
              )}

              {editUserData.role === 'office_staff' && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department:</label>
                    <input
                      type="text"
                      value={editUserData.dept}
                      onChange={(e) => setEditUserData({ ...editUserData, dept: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Designation:</label>
                    <input
                      type="text"
                      value={editUserData.designation}
                      onChange={(e) => setEditUserData({ ...editUserData, designation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

