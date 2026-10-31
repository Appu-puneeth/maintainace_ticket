import React, { useState, useEffect } from 'react';
import {
  QrCode,
  X,
  Download,
  Printer,
  Copy,
  ExternalLink,
  Sparkles,
  Check,
  Building2,
  MapPin
} from 'lucide-react';
import QRCode from 'qrcode';

export const ComplaintQRModal = ({ isOpen, onClose, onNavigateToComplaint }) => {
  const [building, setBuilding] = useState('Block B');
  const [floor, setFloor] = useState('2nd Floor');
  const [room, setRoom] = useState('203');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [complaintUrl, setComplaintUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const url = `${origin}${pathname}?action=complaint&building=${encodeURIComponent(building)}&floor=${encodeURIComponent(floor)}&room=${encodeURIComponent(room)}`;
    setComplaintUrl(url);

    QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((dataUri) => setQrDataUrl(dataUri))
      .catch(() => {
        const fallback = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(url)}&color=0f172a`;
        setQrDataUrl(fallback);
      });
  }, [isOpen, building, floor, room]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(complaintUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDirect = () => {
    if (onNavigateToComplaint) {
      onNavigateToComplaint({ building, floor, room });
      onClose();
    } else {
      window.location.href = complaintUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm">
              <QrCode className="w-6 h-6 text-white" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200">
                DIRECT STUDENT COMPLAINT QR
              </span>
              <h2 className="text-xl font-bold">Generate Complaint QR Code</h2>
            </div>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Scan to report issue directly without login friction</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Form */}
            <div className="space-y-3.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Select Classroom / Location:
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Building:</label>
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Block A">Block A (Academic)</option>
                  <option value="Block B">Block B (Engineering)</option>
                  <option value="Science Block">Science Block (Labs)</option>
                  <option value="Library">Central Library</option>
                  <option value="Canteen">Campus Canteen</option>
                  <option value="Admin Block">Administrative Block</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Floor:</label>
                <select
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Ground Floor">Ground Floor</option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Room / Hall:</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. 203, Lab 2, Washroom B2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] space-y-1">
                <span className="font-bold block">Direct QR Destination:</span>
                <p className="line-clamp-2 font-mono text-[10px] text-blue-700 break-all">
                  {complaintUrl}
                </p>
              </div>
            </div>

            {/* QR Card Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
              <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center max-w-[200px] w-full">
                <div className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">
                  FIXIT COMPLAINT QR
                </div>
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Complaint QR" className="w-36 h-36 object-contain rounded-lg" />
                ) : (
                  <div className="w-36 h-36 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    Generating...
                  </div>
                )}
                <div className="mt-2 text-center">
                  <h4 className="text-xs font-black text-slate-900">{building}</h4>
                  <span className="text-[10px] text-slate-500 font-semibold">Room {room} ({floor})</span>
                </div>
                <div className="mt-1 text-[8px] font-bold text-slate-400 border-t border-slate-100 pt-0.5">
                  Scan to File Complaint
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <a
                href={qrDataUrl}
                download={`Complaint_QR_${building}_Room_${room}.png`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download QR</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenDirect}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Go to Complaint Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

