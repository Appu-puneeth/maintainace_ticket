import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  Calendar,
  User,
  Phone,
  FileText,
  MessageSquare,
  ShieldCheck,
  Camera,
  Trash2,
  ThumbsUp,
  RefreshCw,
  Send,
  Star,
  Upload,
  Download,
  Edit3,
  Check
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/PriorityBadge';
import { TATCountdownTimer } from '../components/TATCountdownTimer';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { FeedbackModal } from '../components/FeedbackModal';
import { useAuth } from '../context/AuthContext';
import { api, downloadPhoto } from '../services/api';

export const TicketDetailsModal = ({ isOpen, onClose, ticket: ticketProp, onRefresh }) => {
  const { user } = useAuth();
  const [ticket, setTicket] = useState(ticketProp);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'proof' | 'updates'
  const [progressNote, setProgressNote] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [tatDate, setTatDate] = useState('');
  const [tatNote, setTatNote] = useState('');
  const [afterPhotoFile, setAfterPhotoFile] = useState(null);
  const [afterPhotoPreview, setAfterPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Edit ticket state for student reporter / admin
  const [isEditingTicket, setIsEditingTicket] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleStartEditTicket = () => {
    setEditTitle(ticket?.title || '');
    setEditLocation(ticket?.location || '');
    setEditDescription(ticket?.description || '');
    setIsEditingTicket(true);
  };

  const handleSaveEditTicket = async () => {
    if (!editTitle.trim() || !editDescription.trim()) return;
    setIsSubmitting(true);
    try {
      const updated = await api.updateTicket(ticket.ticket_id, {
        title: editTitle.trim(),
        location: editLocation.trim(),
        description: editDescription.trim(),
      });
      if (updated) setTicket(updated);
      setIsEditingTicket(false);
      if (onRefresh) onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync ticket prop changes (e.g. after refresh)
  useEffect(() => {
    if (ticketProp) setTicket(ticketProp);
  }, [ticketProp]);

  // If modal opens with a ticket that only has an ID (no full data), fetch it
  useEffect(() => {
    if (!isOpen) return;
    const id = ticketProp?.ticket_id || ticketProp?.custom_id;
    if (id && (!ticketProp?.title || !ticketProp?.description)) {
      setIsFetching(true);
      api.getTicket(id).then(t => setTicket(t)).catch(() => {}).finally(() => setIsFetching(false));
    }
  }, [isOpen, ticketProp]);

  if (!isOpen) return null;
  if (isFetching || !ticket) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-3 shadow-2xl">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-sm font-bold text-slate-700">Loading ticket details...</span>
        </div>
      </div>
    );
  }

  const isReporter = user?.email_id?.toLowerCase() === ticket.reported_by?.toLowerCase();
  const isMaintenance = user?.role === 'admin' || (user?.role === 'office_staff' && user?.dept?.toLowerCase().includes('maintenance'));
  const isAdmin = user?.role === 'admin';

  // Actions
  const handleSaveProgress = async () => {
    if (!progressNote.trim()) return;
    setIsSubmitting(true);
    try {
      const updated = await api.updateTicketStatus(ticket.ticket_id, 'open', progressNote.trim(), null, user);
      setTicket(updated);
      setProgressNote('');
      if (onRefresh) onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetTAT = async () => {
    if (!tatDate) return;
    setIsSubmitting(true);
    try {
      const updated = await api.setTurnaroundTime(ticket.ticket_id, tatDate, tatNote || 'Work scheduled with technician', user);
      setTicket(updated);
      setTatDate('');
      setTatNote('');
      if (onRefresh) onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!resolutionNote.trim()) return;
    setIsSubmitting(true);
    try {
      const photoArg = afterPhotoFile || null;
      const updated = await api.updateTicketStatus(ticket.ticket_id, 'resolved', resolutionNote.trim(), photoArg, user);
      setTicket(updated);
      setResolutionNote('');
      setAfterPhotoFile(null);
      setAfterPhotoPreview('');
      if (onRefresh) onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopenTicket = async () => {
    setIsSubmitting(true);
    try {
      const updated = await api.updateTicketStatus(ticket.ticket_id, 'open', 'Re-opened: Issue requires additional inspection', null, user);
      setTicket(updated);
      if (onRefresh) onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;
    setIsSubmitting(true);
    try {
      await api.deleteTicket(ticket.ticket_id);
      if (onRefresh) onRefresh();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = () => {
    api.upvoteTicket(ticket.ticket_id, user?.usn || user?.email_id);
    if (onRefresh) onRefresh();
  };

  const handleConfirmRepairFeedback = async (ticketId, rating, comment) => {
    await api.acknowledgeTicket(ticketId, rating, comment);
    if (onRefresh) onRefresh();
  };

  // Status Stepper calculation
  const getStepStatus = () => {
    if (ticket.status === 'acknowledged') return 3;
    if (ticket.status === 'resolved') return 2;
    return 1;
  };
  const currentStep = getStepStatus();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white z-20 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {ticket.custom_id || ticket.ticket_id}
                  </span>
                  <PriorityBadge priority={ticket.priority} size="sm" />
                  <StatusBadge status={ticket.status} />
                </div>
                {isEditingTicket ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-sm font-bold text-slate-900 border border-blue-400 rounded-lg px-2.5 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Issue Title"
                    />
                    <button
                      onClick={handleSaveEditTicket}
                      disabled={isSubmitting || !editTitle.trim()}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditingTicket(false)}
                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-lg font-extrabold text-slate-900 truncate">{ticket.title}</h2>
                    {(isAdmin || (isReporter && ticket.status === 'open')) && (
                      <button
                        onClick={handleStartEditTicket}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shrink-0"
                        title="Edit complaint details"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Ticket Progress Stepper (Wireframe Page 3) */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between max-w-md mx-auto relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: currentStep === 3 ? '100%' : currentStep === 2 ? '50%' : '0%' }}
                  />
                </div>

                {/* Step 1: Open */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep >= 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1">Open</span>
                </div>

                {/* Step 2: Resolved */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep >= 2 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1">Resolved</span>
                </div>

                {/* Step 3: Acknowledged */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === 3 ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 mt-1">Acknowledged</span>
                </div>
              </div>

              {/* Turnaround Time SLA Timer Banner */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold">Response Time & SLA:</span>
                  <TATCountdownTimer ticket={ticket} />
                </div>
                {ticket.tat?.expected_by && (
                  <div className="text-slate-500 text-[11px]">
                    Expected Completion: <span className="font-bold text-slate-700">{ticket.tat.expected_by}</span>
                    {ticket.tat.note && ` (${ticket.tat.note})`}
                  </div>
                )}
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Complaint Information */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Location & Category
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-bold text-slate-800">{ticket.issue_type_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                      <span className="text-slate-500">Location:</span>
                      {isEditingTicket ? (
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="text-xs font-bold text-slate-800 border border-slate-300 rounded px-2 py-0.5 text-right"
                        />
                      ) : (
                        <span className="font-bold text-slate-800">{ticket.location}</span>
                      )}
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Building / Room:</span>
                      <span className="font-bold text-slate-800">{ticket.building} · Room {ticket.room}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Priority Level:</span>
                      <span className="capitalize font-bold text-slate-800">{ticket.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Reported By
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-slate-800">{ticket.reported_by_name} ({ticket.reported_by_role})</p>
                    <p className="text-slate-500">{ticket.reported_by} · Dept: {ticket.reported_by_dept || 'General'}</p>
                    <p className="text-slate-400 text-[11px]">
                      Reported on {new Date(ticket.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </p>
                  </div>

                  {/* "Me Too" Upvotes */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Student confirmations: <strong>{ticket.upvotes || 0}</strong>
                    </span>
                    <button
                      onClick={handleUpvote}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg transition-colors"
                      title="Confirm this issue is also affecting you"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Me Too!</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-slate-700 mb-1">Issue Description:</h4>
                  {isEditingTicket ? (
                    <textarea
                      rows="3"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  ) : (
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                  )}
                </div>
              </div>

              {/* Right Column: Visual Proof & Updates */}
              <div className="space-y-4">
                {/* Proof of Repair / Photos */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    Proof of Repair (Before & After)
                  </h4>

                  {ticket.after_photo ? (
                    <BeforeAfterSlider
                      beforeImage={ticket.before_photo || ticket.photo?.url}
                      afterImage={ticket.after_photo}
                      aspectRatio="aspect-[4/3]"
                    />
                  ) : (
                    <div>
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200 group">
                        <img
                          src={ticket.photo?.url || ticket.before_photo}
                          alt="Problem photo"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          BEFORE REPAIR
                        </span>
                        <button
                          type="button"
                          onClick={() => downloadPhoto(ticket.photo?.url || ticket.before_photo, `Complaint_${ticket.custom_id || ticket.ticket_id}.jpg`)}
                          className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Photo</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[11px] text-slate-500">
                          Maintenance has not yet uploaded 'After' photo.
                        </p>
                        <button
                          type="button"
                          onClick={() => downloadPhoto(ticket.photo?.url || ticket.before_photo, `Complaint_${ticket.custom_id || ticket.ticket_id}.jpg`)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Latest Maintenance Update note */}
                {ticket.update && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs">
                    <div className="flex items-center gap-1.5 text-blue-800 font-bold mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Latest Maintenance Note:</span>
                    </div>
                    <p className="text-blue-900">{ticket.update.note}</p>
                    <span className="text-[10px] text-blue-500 mt-1 block">
                      By {ticket.update.updated_by_name || 'Staff'} · {new Date(ticket.update.updated_at).toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {/* Verified Student Feedback (if acknowledged) */}
                {ticket.feedback && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Student Verification & Rating:</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[...Array(ticket.feedback.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-emerald-900 italic">"{ticket.feedback.comment}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* MAINTENANCE ACTION CONTROLS (Wireframe Page 5) */}
            {isMaintenance && ticket.status !== 'acknowledged' && (
              <div className="bg-slate-50 border-2 border-dashed border-amber-300 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <span>🛠️ Maintenance Staff Actions</span>
                  <span className="text-[10px] font-semibold bg-amber-200 px-2 py-0.5 rounded-full">
                    Control Panel
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Action 1: Add Progress Note */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Post Progress Note:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Electrician assigned / spare parts arrived"
                        value={progressNote}
                        onChange={(e) => setProgressNote(e.target.value)}
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSaveProgress}
                        disabled={isSubmitting || !progressNote.trim()}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Action 2: Set Turnaround Time (TAT) */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Set Expected Completion (TAT):
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      <input
                        type="date"
                        value={tatDate}
                        onChange={(e) => setTatDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Note (e.g. Parts ordered)"
                        value={tatNote}
                        onChange={(e) => setTatNote(e.target.value)}
                        className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                      />
                      <button
                        onClick={handleSetTAT}
                        disabled={isSubmitting || !tatDate}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        Set TAT
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action 3: Resolve Ticket with Proof of Repair */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h5 className="text-xs font-bold text-slate-800">
                    Mark As Resolved (Upload Proof of Repair):
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Resolution note (e.g. Capacitor replaced and tested)"
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      className="text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {/* After Photo – File Upload */}
                    <div>
                      <label className="flex items-center gap-2 border border-dashed border-emerald-400 bg-emerald-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-emerald-100 transition-colors text-xs text-emerald-800 font-semibold">
                        <Upload className="w-3.5 h-3.5 shrink-0" />
                        {afterPhotoFile ? afterPhotoFile.name : 'Upload After-Repair Photo (optional)'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setAfterPhotoFile(file);
                            const reader = new FileReader();
                            reader.onload = (ev) => setAfterPhotoPreview(ev.target.result);
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                      {afterPhotoPreview && (
                        <div className="mt-2 relative w-20 h-16 rounded-lg overflow-hidden border border-emerald-200">
                          <img src={afterPhotoPreview} alt="After" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleResolveTicket}
                      disabled={isSubmitting || !resolutionNote.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Resolved with Proof
                    </button>

                    {ticket.status === 'resolved' && (
                      <button
                        onClick={handleReopenTicket}
                        className="text-xs font-semibold text-amber-700 hover:underline"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STUDENT CONFIRM REPAIR ACTION (Wireframe Page 3) */}
            {isReporter && ticket.status === 'resolved' && (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Maintenance Team Marked This Issue as Fixed!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto mt-0.5">
                    Please inspect the work in {ticket.location}. If satisfied, confirm the repair and submit your rating.
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>CONFIRM REPAIR & GIVE FEEDBACK</span>
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {(isAdmin || (isReporter && ticket.status === 'open')) && (
                <button
                  onClick={handleDeleteTicket}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isReporter ? 'Withdraw Complaint' : 'Delete Ticket'}</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="ml-auto px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Feedback & Star Rating Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        ticket={ticket}
        onConfirm={handleConfirmRepairFeedback}
      />
    </>
  );
};

