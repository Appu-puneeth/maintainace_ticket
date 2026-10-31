import React, { useState, useEffect } from 'react';
import {
  Plus,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Search,
  Building2,
  Sparkles,
  QrCode,
  ThumbsUp,
  User,
  ArrowRight,
  ShieldAlert,
  Layers,
  ChevronRight,
  Edit3,
  Download,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, downloadPhoto } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/PriorityBadge';
import { TATCountdownTimer } from '../components/TATCountdownTimer';

export const StudentDashboard = ({
  activeTab,
  onSelectTab,
  onViewTicket,
  onOpenQRScanner,
  scannedLocation,
  clearScannedLocation,
}) => {
  const { user, setUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Student Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    dept: user?.dept || 'CSE',
    phone_number: user?.phone_number || '',
    usn: user?.usn || '',
  });
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Sync profile form when user updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        dept: user.dept || 'CSE',
        phone_number: user.phone_number || '',
        usn: user.usn || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...user,
        name: profileForm.name,
        dept: profileForm.dept,
        phone_number: profileForm.phone_number,
        usn: profileForm.usn,
      };
      await api.updateUser(user.email_id, updatedUser);
      setUser(updatedUser);
      localStorage.setItem('FIXIT_USER', JSON.stringify(updatedUser));
      setIsEditingProfile(false);
      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    } catch {
      alert('Failed to update profile');
    }
  };

  // Form State for Report New Issue
  const [formData, setFormData] = useState({
    issue_type_id: '',
    title: '',
    building: 'Block B',
    floor: '2nd Floor',
    room: '203',
    description: '',
    priority: 'medium',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [smartPriority, setSmartPriority] = useState(null);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // If a location was scanned via QR, update form
  useEffect(() => {
    if (scannedLocation) {
      setFormData((prev) => ({
        ...prev,
        building: scannedLocation.building,
        floor: scannedLocation.floor,
        room: scannedLocation.room,
      }));
      onSelectTab('raise-ticket');
    }
  }, [scannedLocation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ticketRes, typeRes] = await Promise.all([
        api.getTickets({ email: user?.email_id, mine: 'true' }),
        api.getIssueTypes(),
      ]);
      setTickets(ticketRes.items || []);
      setIssueTypes(typeRes.items || []);
      if (typeRes.items?.length > 0 && !formData.issue_type_id) {
        setFormData((prev) => ({ ...prev, issue_type_id: typeRes.items[0].issue_type_id }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Real-time Smart Priority Detection Engine (Feature 2)
  useEffect(() => {
    if (formData.title.length > 3 || formData.description.length > 5) {
      const detected = api.detectSmartPriority(formData.title, formData.description);
      setSmartPriority(detected);
      setFormData((prev) => ({ ...prev, priority: detected.priority }));
    } else {
      setSmartPriority(null);
    }
  }, [formData.title, formData.description]);

  // Real-time Duplicate Complaint Detection (Feature 3)
  useEffect(() => {
    if (formData.room && (formData.building || formData.room)) {
      const result = api.checkDuplicates(
        `${formData.building} ${formData.room}`,
        formData.building,
        formData.room,
        formData.issue_type_id
      );
      if (result.has_duplicates) {
        setDuplicateWarning(result.duplicates[0]);
      } else {
        setDuplicateWarning(null);
      }
    }
  }, [formData.building, formData.room, formData.issue_type_id]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setIsSubmitting(true);
    try {
      // Build FormData so we can include the file
      const fd = new FormData();
      fd.append('issue_type_id', formData.issue_type_id);
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('building', formData.building);
      fd.append('floor', formData.floor);
      fd.append('room', formData.room);
      fd.append('priority', formData.priority);
      if (photoFile) fd.append('photo', photoFile);

      const created = await api.raiseTicketWithFile(fd, user);
      setSubmissionSuccess(created);
      setFormData({
        issue_type_id: issueTypes[0]?.issue_type_id || '',
        title: '',
        building: 'Block B',
        floor: '2nd Floor',
        room: '203',
        description: '',
        priority: 'medium',
      });
      setPhotoFile(null);
      setPhotoPreview('');
      if (clearScannedLocation) clearScannedLocation();
      loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;
  const acknowledgedCount = tickets.filter((t) => t.status === 'acknowledged').length;

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD VIEW (Wireframe Page 2 & Screenshot Page 5) */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div
              className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"
            />
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                🎓 Student Portal · {user?.dept || 'Campus'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
                Hello, {user?.name || 'Student'}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                Have a maintenance issue in classroom, lab or hostel? Raise a ticket and the campus maintenance team will take care of it with tracked turnaround time.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectTab('raise-ticket')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shadow-md hover:bg-blue-50 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>＋ Raise New Ticket</span>
                </button>
                <button
                  onClick={onOpenQRScanner}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm transition-all"
                >
                  <QrCode className="w-4 h-4 text-blue-200" />
                  <span>Quick QR Scan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metric Cards (PDF 2 Page 5) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block">My Total Tickets</span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {String(totalCount).padStart(2, '0')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">All reported requests</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-amber-600 font-semibold block">Open</span>
              <div className="text-3xl font-black text-amber-500 mt-2">
                {String(openCount).padStart(2, '0')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Needs attention</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-emerald-600 font-semibold block">Resolved</span>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                {String(resolvedCount).padStart(2, '0')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Ready for your verification</span>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
              <span className="text-xs text-indigo-600 font-semibold block">Acknowledged</span>
              <div className="text-3xl font-black text-indigo-600 mt-2">
                {String(acknowledgedCount).padStart(2, '0')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Successfully completed</span>
            </div>
          </div>

          {/* Quick Actions Bar (PDF 2 Page 5) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => onSelectTab('raise-ticket')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">📝</div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600">Raise a Ticket</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Report a classroom, laboratory or campus maintenance issue.
                </p>
                <button className="mt-4 px-3 py-1.5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-semibold rounded-xl">
                  Create Ticket
                </button>
              </div>

              <div
                onClick={() => onSelectTab('my-tickets')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">🎫</div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600">My Tickets</h4>
                <p className="text-xs text-slate-500 mt-1">
                  View the complaints you have submitted and their current status.
                </p>
                <button className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 group-hover:bg-blue-100 text-xs font-semibold rounded-xl">
                  View Tickets
                </button>
              </div>

              <div
                onClick={onOpenQRScanner}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">📷</div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600">Smart QR Reporting</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Scan any classroom FixIt sticker to auto-fill location instantly.
                </p>
                <button className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-600 group-hover:bg-blue-100 text-xs font-semibold rounded-xl">
                  Scan Sticker
                </button>
              </div>
            </div>
          </div>

          {/* Recent Tickets Table (Screenshot Page 6) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Tickets</h3>
                <p className="text-xs text-slate-400">Your latest campus maintenance submissions</p>
              </div>
              <button
                onClick={() => onSelectTab('my-tickets')}
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
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Priority</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tickets.slice(0, 5).map((ticket) => (
                    <tr key={ticket.ticket_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {ticket.custom_id || ticket.ticket_id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {ticket.title}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {ticket.location}
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onViewTicket(ticket)}
                          className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tickets.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                        No complaints raised yet. Click 'Raise New Ticket' to report an issue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 2. RAISE A TICKET VIEW (Wireframe Page 2 - Bottom) */}
      {activeTab === 'raise-ticket' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-5 border-b border-slate-100">
            <div>
              <button
                onClick={() => onSelectTab('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:underline mb-1 inline-block"
              >
                ← Back to Dashboard
              </button>
              <h2 className="text-xl font-extrabold text-slate-900">Report a Maintenance Issue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Describe the problem below with location and photo</p>
            </div>

            <button
              onClick={onOpenQRScanner}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Auto-Fill with QR</span>
            </button>
          </div>

          {/* Submission Success Alert */}
          {submissionSuccess && (
            <div className="my-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Complaint Raised Successfully!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your unique ticket ID is{' '}
                    <strong className="font-mono text-emerald-950 font-black">
                      {submissionSuccess.custom_id || submissionSuccess.ticket_id}
                    </strong>
                    . Maintenance staff has been notified.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubmissionSuccess(null)}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* DUPLICATE DETECTION WARNING (Feature 3) */}
          {duplicateWarning && (
            <div className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 animate-fadeIn">
              <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Duplicate Complaint Detected for this Room!
                  </h4>
                  <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Already Active
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  Ticket <strong>{duplicateWarning.custom_id}</strong> ("{duplicateWarning.title}") is already reported for{' '}
                  <strong>{duplicateWarning.location}</strong>. Status: <em>{duplicateWarning.status}</em>.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      api.upvoteTicket(duplicateWarning.ticket_id, user?.usn || user?.email_id);
                      alert(`Upvoted! Your verification has been added to ticket ${duplicateWarning.custom_id}`);
                      setDuplicateWarning(null);
                      onSelectTab('dashboard');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Me Too! Upvote This Issue (Prevents duplicate tickets)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitComplaint} className="mt-6 space-y-4">
            {/* Category dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.issue_type_id}
                onChange={(e) => setFormData({ ...formData, issue_type_id: e.target.value })}
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                {issueTypes.map((type) => (
                  <option key={type.issue_type_id} value={type.issue_type_id}>
                    {type.name} ({type.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Classroom 203 ka electrical wire exposed hai"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Smart Location: Block | Floor | Room (No GPS/Location API) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Location (Block | Floor | Room) <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-blue-600 font-medium">Smart QR Decoded</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Science Block">Science Block</option>
                  <option value="Library">Library</option>
                  <option value="Canteen">Canteen</option>
                  <option value="Admin Block">Admin Block</option>
                </select>

                <select
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="text-xs px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                </select>

                <input
                  type="text"
                  placeholder="Room (e.g. 203)"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="text-xs px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue in detail, exact position, and safety precautions..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Photo Upload – Direct File Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Upload Complaint Photo</span>
                <span className="text-[10px] text-slate-400">JPEG/PNG, max 5MB</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-colors">
                <Camera className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-500">
                  {photoFile ? photoFile.name : 'Click to choose photo or drag & drop'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPhotoFile(file);
                    const reader = new FileReader();
                    reader.onload = (ev) => setPhotoPreview(ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              {photoPreview && (
                <div className="mt-3 relative w-32 h-24 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(''); }}
                    className="absolute top-1 right-1 bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                  >Remove</button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">Preview</span>
                </div>
              )}
            </div>

            {/* SMART PRIORITY DETECTION BANNER (Feature 2) */}
            {smartPriority && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">AI Suggested Priority:</span>
                      <PriorityBadge priority={smartPriority.priority} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{smartPriority.rationale}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">TARGET SLA</span>
                  <span className="text-xs font-bold text-slate-800">{smartPriority.slaHours}h Response</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectTab('dashboard')}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Complaint'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. MY TICKETS VIEW (Wireframe Page 2 - Bottom) */}
      {activeTab === 'my-tickets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">My Maintenance Tickets</h2>
              <p className="text-xs text-slate-500">Track real-time progress, response times and verify repairs</p>
            </div>
            <button
              onClick={() => onSelectTab('raise-ticket')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Report New Issue</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <div
                key={t.ticket_id}
                onClick={() => onViewTicket(t)}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {t.custom_id || t.ticket_id.slice(-8)}
                    </span>
                    <PriorityBadge priority={t.priority} size="sm" />
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                <h3 className="font-bold text-sm text-slate-900 mt-3">{t.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {t.location}
                  </span>
                  <div className="flex items-center gap-2">
                    {(t.before_photo || t.photo?.url) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPhoto(t.before_photo || t.photo?.url, `Complaint_${t.custom_id || t.ticket_id}.jpg`);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                        title="Download complaint photo"
                      >
                        <Download className="w-3 h-3" />
                        <span>Photo</span>
                      </button>
                    )}
                    <TATCountdownTimer ticket={t} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PROFILE VIEW (Wireframe Page 9) */}
      {activeTab === 'profile' && (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <button
              onClick={() => downloadPhoto(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'Student')}`, `Student_Photo_${user?.usn || 'ID'}.svg`)}
              className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow transition-colors"
              title="Download Student ID Photo"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            <h2 className="text-lg font-black text-slate-900">{user?.name || 'Student Name'}</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 mt-1">
            Student · {user?.dept || 'Engineering'}
          </span>

          {profileSuccessMsg && (
            <div className="mt-3 p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-200">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-3 text-left text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Full Name:</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Department:</label>
                <select
                  value={profileForm.dept}
                  onChange={(e) => setProfileForm({ ...profileForm, dept: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ISE">Information Science (ISE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="MECH">Mechanical (MECH)</option>
                  <option value="CIVIL">Civil (CIVIL)</option>
                  <option value="MBA">MBA / Management</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Phone Number:</label>
                <input
                  type="tel"
                  value={profileForm.phone_number}
                  onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">University USN:</label>
                <input
                  type="text"
                  value={profileForm.usn}
                  onChange={(e) => setProfileForm({ ...profileForm, usn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono uppercase font-bold"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-3 text-left text-xs bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-slate-800">{user?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-bold text-slate-800">{user?.email_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-800">{user?.dept}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-bold text-slate-800">{user?.phone_number}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">University USN:</span>
                <span className="font-mono font-bold text-blue-600">{user?.usn || '1CF24CS042'}</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => downloadPhoto(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'Student')}`, `Student_Photo_${user?.usn || 'ID'}.svg`)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              title="Download Student ID Photo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Photo</span>
            </button>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            )}
            <button
              onClick={() => onSelectTab('dashboard')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

