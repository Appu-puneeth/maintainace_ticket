import React, { useState } from 'react';
import { Star, CheckCircle, X, ThumbsUp, ShieldCheck } from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';

export const FeedbackModal = ({ isOpen, onClose, ticket, onConfirm }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Workmanship verified. Everything is safe and functioning properly.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(ticket.ticket_id, rating, comment);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </span>
            <div>
              <h3 className="font-bold text-base">Confirm & Acknowledge Repair</h3>
              <p className="text-xs text-emerald-100">Ticket #{ticket.custom_id || ticket.ticket_id.slice(-6)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Proof of Repair Inspection */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Visual Proof of Repair:
            </h4>
            <BeforeAfterSlider
              beforeImage={ticket.before_photo || ticket.photo?.url}
              afterImage={ticket.after_photo}
              aspectRatio="aspect-[16/9]"
            />
          </div>

          {/* Star Rating */}
          <div className="text-center pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Rate Maintenance Team Service:
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">
              {rating === 5 ? 'Excellent & Prompt Fix' : rating === 4 ? 'Good Quality' : 'Average Work'}
            </span>
          </div>

          {/* Feedback comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Feedback / Inspection Note:
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="Was the problem completely resolved? Any remarks..."
            />
          </div>

          {/* Confirm Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Closing Ticket...' : 'Confirm Repair & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

