import React, { useState } from 'react';
import { Play, Check, ChevronRight, AlertTriangle, QrCode, Camera, ShieldCheck, UserCheck, Sparkles, RefreshCw, X } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BeforeAfterSlider } from './BeforeAfterSlider';

export const ScenarioWalkthroughModal = ({ isOpen, onClose, onRefreshData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const { quickLoginAs } = useAuth();

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: 'Student Classroom ka QR Scan karta hai',
      desc: 'Mahesh reaches Classroom 203 in Block B, notices an electrical hazard, and opens the FixIt camera/scanner.',
      icon: QrCode,
      color: 'blue',
      role: 'student',
      actionLabel: 'Simulate Step 1: Scan Classroom 203 QR',
    },
    {
      num: 2,
      title: 'Location automatically Classroom 203 fill hoti hai',
      desc: 'Without manual GPS or typing, the smart QR data auto-populates "Block B, 2nd Floor, Classroom 203" into the complaint form.',
      icon: Check,
      color: 'indigo',
      role: 'student',
      actionLabel: 'Simulate Step 2: Auto-fill Location',
    },
    {
      num: 3,
      title: 'Student exposed wire ki photo upload karta hai',
      desc: 'Mahesh takes a photo of the live loose wire hanging near the switchboard and enters "Classroom 203 electrical wire exposed".',
      icon: Camera,
      color: 'violet',
      role: 'student',
      actionLabel: 'Simulate Step 3: Attach Hazard Photo',
    },
    {
      num: 4,
      title: 'System priority CRITICAL suggest karta hai',
      desc: 'Smart Priority Detection AI engine analyzes "exposed wire" + "electrical" and flags it as CRITICAL with 2-4 hr SLA target.',
      icon: AlertTriangle,
      color: 'rose',
      role: 'student',
      actionLabel: 'Simulate Step 4: Run AI Priority Engine',
    },
    {
      num: 5,
      title: 'Maintenance dashboard par urgent alert aata hai',
      desc: 'Maintenance Supervisor Kumar Gowda receives a flashing red urgent notification and alarm for Classroom 203 hazard.',
      icon: Sparkles,
      color: 'amber',
      role: 'maintenance',
      actionLabel: 'Simulate Step 5: Switch to Maintenance Alert',
    },
    {
      num: 6,
      title: 'Technician complaint accept karta hai & TAT set karta hai',
      desc: 'Kumar accepts the ticket, dispatches electrician Ramesh, and sets emergency Turnaround Time (TAT) to 2 hours.',
      icon: UserCheck,
      color: 'cyan',
      role: 'maintenance',
      actionLabel: 'Simulate Step 6: Dispatch & Set TAT',
    },
    {
      num: 7,
      title: 'Technician repair ke Before & After photos upload karta hai',
      desc: 'Electrician insulates wire, replaces conduit pipe, tests voltage, and uploads high-resolution "After Repair" proof photo.',
      icon: Camera,
      color: 'emerald',
      role: 'maintenance',
      actionLabel: 'Simulate Step 7: Upload Proof of Repair',
    },
    {
      num: 8,
      title: 'Student repair inspect aur acknowledge karta hai',
      desc: 'Mahesh checks the interactive before/after slider proof, gives 5-star rating, and confirms repair closure.',
      icon: ShieldCheck,
      color: 'teal',
      role: 'student',
      actionLabel: 'Simulate Step 8: Confirm & Close Repair',
    },
    {
      num: 9,
      title: 'Admin dashboard par resolved ticket update ho jata hai',
      desc: 'Real-time metrics on Admin & Maintenance dashboards reflect 100% completion, updating campus health analytics.',
      icon: Sparkles,
      color: 'purple',
      role: 'admin',
      actionLabel: 'Simulate Step 9: View Admin Resolution',
    },
  ];

  const handleExecuteStep = async (stepNum) => {
    setIsSimulating(true);

    try {
      if (stepNum === 1 || stepNum === 2) {
        quickLoginAs('student');
      } else if (stepNum === 3) {
        // Create the scenario ticket if not already present
        const scenarioTicket = {
          issue_type_id: 'ITY-101',
          title: 'Exposed live electrical wire in Classroom 203',
          description: 'Classroom 203, Block B: live copper wire dangling from main switchboard. Severe shock hazard for students.',
          building: 'Block B',
          floor: '2nd Floor',
          room: '203',
          location: 'Classroom 203, Block B (2nd Floor)',
          priority: 'critical',
          photo_url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=60',
        };
        await api.raiseTicket(scenarioTicket, {
          name: 'Mahesh Sharma',
          email_id: 'mahesh@team1.com',
          role: 'student',
          dept: 'CSE',
          phone_number: '9876543210',
        });
      } else if (stepNum === 5 || stepNum === 6) {
        quickLoginAs('maintenance');
        // Update TAT on scenario ticket
        const tickets = (await api.getTickets()).items;
        const target = tickets.find(t => t.room === '203' && t.title.includes('wire'));
        if (target) {
          const today = new Date().toISOString().split('T')[0];
          await api.setTurnaroundTime(target.ticket_id, today, 'Emergency electrician dispatched with insulated conduit', {
            name: 'Kumar Gowda',
            email_id: 'kumar@team1.com',
          });
        }
      } else if (stepNum === 7) {
        quickLoginAs('maintenance');
        const tickets = (await api.getTickets()).items;
        const target = tickets.find(t => t.room === '203' && t.title.includes('wire'));
        if (target) {
          await api.updateTicketStatus(
            target.ticket_id,
            'resolved',
            'Wire re-routed into safety PVC conduit, breaker tested, certified safe',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60',
            { name: 'Kumar Gowda', email_id: 'kumar@team1.com' }
          );
        }
      } else if (stepNum === 8) {
        quickLoginAs('student');
        const tickets = (await api.getTickets()).items;
        const target = tickets.find(t => t.room === '203' && t.title.includes('wire'));
        if (target) {
          await api.acknowledgeTicket(target.ticket_id, 5, 'Hazard eliminated within 30 minutes! Great prompt action.');
        }
      } else if (stepNum === 9) {
        quickLoginAs('admin');
      }

      if (onRefreshData) onRefreshData();

      if (stepNum < 9) {
        setCurrentStep(stepNum + 1);
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const activeStepObj = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-blue-500/30 text-blue-300">
              <Play className="w-5 h-5 fill-current" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-blue-300">
                SCENARIO SIMULATOR
              </span>
              <h2 className="text-xl font-bold">Classroom 203: Exposed Wire Life Cycle</h2>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            Interactive step-by-step execution of the exact scenario given in the brief.
          </p>

          {/* Stepper Progress Bar */}
          <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex-1 min-w-[28px] h-2 rounded-full transition-all ${
                  s.num < currentStep
                    ? 'bg-emerald-500'
                    : s.num === currentStep
                    ? 'bg-blue-400 ring-2 ring-blue-300'
                    : 'bg-white/20'
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm border border-blue-100">
              {currentStep}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Role: {activeStepObj.role}
                </span>
                <span className="text-xs text-slate-400">Step {currentStep} of 9</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-1">{activeStepObj.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activeStepObj.desc}</p>
            </div>
          </div>

          {/* Step 7 Visual Demo (Before/After) */}
          {currentStep === 7 && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=800&auto=format&fit=crop&q=60"
                afterImage="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60"
                aspectRatio="aspect-[16/9]"
              />
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40"
            >
              Previous Step
            </button>

            <button
              onClick={() => handleExecuteStep(currentStep)}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Scenario...</span>
                </>
              ) : (
                <>
                  <span>{activeStepObj.actionLabel}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

