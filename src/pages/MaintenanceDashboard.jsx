import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  FolderTree,
  QrCode,
  Download,
  Printer,
  Sparkles,
  Layers,
  Building2,
  Trash2,
  Calendar,
  BarChart3,
  Flame,
  ArrowRight,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, downloadPhoto } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/PriorityBadge';
import { TATCountdownTimer } from '../components/TATCountdownTimer';
import { CampusHeatmap } from '../components/CampusHeatmap';
import QRCode from 'qrcode';

export const MaintenanceDashboard = ({ activeTab, onSelectTab, onViewTicket }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedHeatmapBuilding, setSelectedHeatmapBuilding] = useState(null);

  // Issue Category Management Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);

  // QR Code Generator State (Wireframe Page 7)
  const [qrBuilding, setQrBuilding] = useState('Block B');
  const [qrFloor, setQrFloor] = useState('2nd Floor');
  const [qrRoom, setQrRoom] = useState('203');
  const [generatedQRUrl, setGeneratedQRUrl] = useState('');
  const [directComplaintUrl, setDirectComplaintUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ticketRes, typeRes] = await Promise.all([
        api.getTickets(),
        api.getIssueTypes(),
      ]);
      setTickets(ticketRes.items || []);
      setIssueTypes(typeRes.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 15 seconds to pick up new student tickets automatically
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Generate QR Code dynamically pointing to the direct student complaint page
  useEffect(() => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const complaintUrl = `${origin}${pathname}?action=complaint&building=${encodeURIComponent(qrBuilding)}&floor=${encodeURIComponent(qrFloor)}&room=${encodeURIComponent(qrRoom)}`;
    setDirectComplaintUrl(complaintUrl);

    QRCode.toDataURL(complaintUrl, { width: 350, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(url => setGeneratedQRUrl(url))
      .catch(() => {
        const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(complaintUrl)}&color=0f172a`;
        setGeneratedQRUrl(fallbackUrl);
      });
  }, [qrBuilding, qrFloor, qrRoom]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await api.createIssueType(newCatName.trim(), newCatDesc.trim());
    setNewCatName('');
    setNewCatDesc('');
    setShowAddCatModal(false);
    loadData();
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    await api.deleteIssueType(id);
    loadData();
  };

  // Metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length;
  const awaitingAck = tickets.filter((t) => t.status === 'resolved' && !t.acknowledged_at).length;
  const criticalIssues = tickets.filter((t) => t.priority === 'critical' && t.status === 'open').length;
  const overdueTickets = tickets.filter((t) => t.overdue || (t.status === 'open' && t.tat && new Date(t.tat.expected_by) < new Date())).length;

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.custom_id && t.custom_id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = !categoryFilter || t.issue_type_id === categoryFilter;
    const matchesStatus = !statusFilter || t.status === statusFilter;
    const matchesPriority = !priorityFilter || t.priority === priorityFilter;
    const matchesBuilding = !selectedHeatmapBuilding || t.building === selectedHeatmapBuilding;
    return matchesSearch && matchesCat && matchesStatus && matchesPriority && matchesBuilding;
  });

  // Analytics: Complaints by Type
  const categoryCounts = issueTypes.map((type) => {
    const count = tickets.filter((t) => t.issue_type_id === type.issue_type_id).length;
    return { name: type.name, count };
  });

  return (
    <div className="space-y-6">
      {/* 1. DASHBOARD OVERVIEW (Wireframe Page 4 & Screenshot Page 3) */}
      {activeTab === 'dashboard' && (
        <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                🛠️ Campus Maintenance Workspace
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-3">Welcome to your workspace</h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed">
                Track campus issues in one place. Review requests from students and staff, update ticket progress, dispatch technicians, and keep everyone informed until the issue is resolved.
              </p>
            </div>
          </div>

          {/* Metric Cards Grid (PDF 2 Page 3 & Wireframe Page 4) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-[11px] text-slate-500 font-semibold block">All Tickets</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalTickets}</div>
              <span className="text-[10px] text-slate-400">Total reported</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-[11px] text-amber-600 font-semibold block">Open</span>
              <div className="text-2xl font-black text-amber-500 mt-1">{openTickets}</div>
              <span className="text-[10px] text-slate-400">Needs attention</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-[11px] text-emerald-600 font-semibold block">Resolved</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedTickets}</div>
              <span className="text-[10px] text-slate-400">Completed repairs</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-[11px] text-indigo-600 font-semibold block">Awaiting Ack</span>
              <div className="text-2xl font-black text-indigo-600 mt-1">{awaitingAck}</div>
              <span className="text-[10px] text-slate-400">With student</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-sm bg-rose-50/50">
              <span className="text-[11px] text-rose-700 font-bold block flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                Critical
              </span>
              <div className="text-2xl font-black text-rose-600 mt-1">{criticalIssues}</div>
              <span className="text-[10px] text-rose-500">Urgent Hazards</span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
              <span className="text-[11px] text-orange-600 font-semibold block">Overdue</span>
              <div className="text-2xl font-black text-orange-600 mt-1">{overdueTickets}</div>
              <span className="text-[10px] text-slate-400">Exceeded SLA</span>
            </div>
          </div>

          {/* CAMPUS MAINTENANCE HEATMAP (Feature 6) */}
          <CampusHeatmap
            onSelectBuilding={(building) => setSelectedHeatmapBuilding(building)}
            selectedBuilding={selectedHeatmapBuilding}
          />

          {/* Recent Campus Tickets Board (PDF 2 Page 4 & Wireframe Page 4) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recent Campus Maintenance Requests</h3>
                <p className="text-xs text-slate-400">
                  {selectedHeatmapBuilding ? `Filtering by ${selectedHeatmapBuilding}` : 'All campus zones'}
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs pl-8 pr-2 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                  <option value="acknowledged">Acknowledged</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Ticket ID</th>
                    <th className="px-5 py-3">Issue</th>
                    <th className="px-5 py-3">Reported By</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">SLA / TAT</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTickets.map((t) => (
                    <tr key={t.ticket_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                        {t.custom_id || t.ticket_id.slice(-8)}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {t.title}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {t.reported_by_name} ({t.reported_by_dept || 'Student'})
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {t.location}
                      </td>
                      <td className="px-5 py-3.5">
                        <PriorityBadge priority={t.priority} size="sm" />
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <TATCountdownTimer ticket={t} />
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {(t.before_photo || t.photo?.url) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadPhoto(t.before_photo || t.photo?.url, `Ticket_${t.custom_id || t.ticket_id}.jpg`);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                            title="Download Photo"
                          >
                            <Download className="w-3 h-3" />
                            <span>Photo</span>
                          </button>
                        )}
                        <button
                          onClick={() => onViewTicket(t)}
                          className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-5 py-8 text-center text-slate-400">
                        No maintenance tickets matching filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Row: Complaints by Type & Status (Wireframe Page 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Complaints by Type Bar Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Complaints by Category (Bar Chart)
                </h4>
                <span className="text-xs text-slate-400">Live Breakdown</span>
              </div>

              <div className="space-y-3">
                {categoryCounts.map((cat) => {
                  const percent = totalTickets ? Math.round((cat.count / totalTickets) * 100) : 0;
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{cat.name}</span>
                        <span className="font-bold text-slate-900">{cat.count} tickets ({percent}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Turnaround Time SLA Guidelines */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Turnaround Time (TAT) & Response Policy
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Prioritize urgent safety and facility issues first. Update expected completion time when parts are ordered.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-red-50 text-red-800 border border-red-200">
                    <span className="font-bold">CRITICAL HAZARDS (Shock, Fire, Live Wire)</span>
                    <span className="font-black">2 - 4 Hours SLA</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="font-bold">HIGH PRIORITY (Water Burst, Lab Fan)</span>
                    <span className="font-black">12 Hours SLA</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
                    <span className="font-bold">MEDIUM (Tube Light, Projector, Lock)</span>
                    <span className="font-black">24 Hours SLA</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                    <span className="font-bold">LOW (Aesthetic, Painting, Cleaning)</span>
                    <span className="font-black">48 Hours SLA</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>FixIt Response Engine</span>
                <span className="text-blue-600 font-bold">Auto-calculated</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. ISSUE CATEGORY MANAGEMENT (Wireframe Page 6) */}
      {activeTab === 'issue-types' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Manage Issue Categories</h2>
              <p className="text-xs text-slate-500">
                Configure ticket categories used by students and staff to report problems
              </p>
            </div>
            <button
              onClick={() => setShowAddCatModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>[+ ADD New Category]</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Category ID</th>
                  <th className="px-5 py-3">Category Name</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {issueTypes.map((type) => (
                  <tr key={type.issue_type_id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {type.issue_type_id}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {type.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {type.description}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteCategory(type.issue_type_id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. QR CODE MANAGEMENT (Wireframe Page 7) */}
      {activeTab === 'qr-codes' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-600">
                <QrCode className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600">
                  SMART REPORTING SYSTEM
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">Campus QR Code Management</h2>
              </div>
            </div>

            {/* Innovative Slogan */}
            <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Scan it. Report it. Fix it.</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Generate and print unique smart QR codes for every classroom, laboratory, washroom, and seminar hall on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: QR Generator Form */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Generate QR Code</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Building Name:</label>
                <select
                  value={qrBuilding}
                  onChange={(e) => setQrBuilding(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Block A">Block A (Academic)</option>
                  <option value="Block B">Block B (Engineering)</option>
                  <option value="Science Block">Science & Lab Wing</option>
                  <option value="Library">Central Library</option>
                  <option value="Canteen">Campus Canteen</option>
                  <option value="Admin Block">Administrative Block</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Floor Number:</label>
                <select
                  value={qrFloor}
                  onChange={(e) => setQrFloor(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room / Hall Number:</label>
                <input
                  type="text"
                  value={qrRoom}
                  onChange={(e) => setQrRoom(e.target.value)}
                  placeholder="e.g. Classroom 203, Lab 2"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              {/* How it works info box (Wireframe Page 7) */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 space-y-2">
                <span className="font-bold block">Direct Student Complaint QR Flow:</span>
                <p className="text-[11px] leading-relaxed">
                  When a student scans this QR with their mobile camera, it directly opens the <strong>FixIt Complaint Submission Form</strong> with location auto-filled ({qrBuilding} Room {qrRoom}) so they can lodge complaints instantly without friction.
                </p>
                <div className="pt-2 border-t border-blue-200/80 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-blue-700 truncate max-w-[200px]" title={directComplaintUrl}>
                    {directComplaintUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(directComplaintUrl);
                      setCopiedUrl(true);
                      setTimeout(() => setCopiedUrl(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-blue-100 text-blue-700 font-bold rounded-lg border border-blue-300 transition-colors shrink-0"
                  >
                    {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Printable QR Card Preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-white border-2 border-dashed border-slate-300 rounded-3xl text-center space-y-4">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-lg flex flex-col items-center">
                <div className="text-[11px] font-black uppercase tracking-widest text-blue-600 mb-2">
                  FIXIT CAMPUS STICKER
                </div>
                <img
                  src={generatedQRUrl}
                  alt="Generated Campus QR"
                  className="w-48 h-48 object-contain rounded-lg shadow-sm"
                />
                <div className="mt-3">
                  <h4 className="text-base font-extrabold text-slate-900">{qrBuilding} · Room {qrRoom}</h4>
                  <span className="text-xs text-slate-500 font-semibold">{qrFloor}</span>
                </div>
                <div className="mt-2 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-1">
                  Scan it. Report it. Fix it.
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href={generatedQRUrl}
                  download={`FixIt_Complaint_QR_${qrBuilding}_Room_${qrRoom}.png`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sticker</span>
                </button>
                <a
                  href={directComplaintUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Scan Link</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ALL TICKETS VIEW */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">All Campus Maintenance Tickets</h2>
              <p className="text-xs text-slate-500">Monitor and update all campus issues across all roles</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <div
                key={t.ticket_id}
                onClick={() => onViewTicket(t)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono font-bold text-xs text-slate-900">{t.custom_id}</span>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={t.priority} size="sm" />
                    <StatusBadge status={t.status} />
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mt-2">{t.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t.location} · {t.reported_by_name}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <TATCountdownTimer ticket={t} />
                  <div className="flex items-center gap-2">
                    {(t.before_photo || t.photo?.url) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPhoto(t.before_photo || t.photo?.url, `Ticket_${t.custom_id || t.ticket_id}.jpg`);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded-lg transition-colors"
                        title="Download photo"
                      >
                        <Download className="w-3 h-3" />
                        <span>Photo</span>
                      </button>
                    )}
                    <span className="text-xs text-blue-600 font-bold">Manage ➔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Add New Issue Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Laboratory Equipment"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description:</label>
                <textarea
                  rows="3"
                  placeholder="Oscilloscopes, microscopes, chemical storage..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

