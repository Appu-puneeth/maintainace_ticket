import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { MaintenanceDashboard } from './pages/MaintenanceDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { TicketDetailsModal } from './pages/TicketDetailsModal';
import { QRScannerModal } from './components/QRScannerModal';
import { ComplaintQRModal } from './components/ComplaintQRModal';
import { ScenarioWalkthroughModal } from './components/ScenarioWalkthroughModal';
import { SettingsModal } from './components/SettingsModal';
import { api } from './services/api';

export function AppContent() {
  const { user, quickLoginAs } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showComplaintQR, setShowComplaintQR] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [scannedLocation, setScannedLocation] = useState(null);
  const [counts, setCounts] = useState({ tickets: 0, users: 0, myTickets: 0 });

  // Handle direct complaint QR scan from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'complaint' || params.get('report') === 'true') {
      const bldg = params.get('building') || 'Block B';
      const flr = params.get('floor') || '2nd Floor';
      const rm = params.get('room') || '203';
      setScannedLocation({
        building: bldg,
        floor: flr,
        room: rm,
        location: `${bldg} - Floor ${flr} - Room ${rm}`,
      });
      if (!user) {
        quickLoginAs('student');
      }
      setActiveTab('raise-ticket');
    }
  }, []);

  // Whenever user role changes, default back to 'dashboard' tab (unless scanned direct complaint)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') !== 'complaint' && params.get('report') !== 'true') {
      setActiveTab('dashboard');
    }
    fetchCounts();
  }, [user]);

  const fetchCounts = async () => {
    try {
      const tickets = (await api.getTickets()).items;
      let myTickets = 0;
      if (user) {
        myTickets = tickets.filter(t => t.reported_by?.toLowerCase() === user.email_id?.toLowerCase()).length;
      }
      const users = (await api.listUsers()).count;
      setCounts({ tickets: tickets.length, users, myTickets });
    } catch {
      // ignore
    }
  };

  const handleLocationScanned = (locData) => {
    setScannedLocation(locData);
    if (!user) {
      quickLoginAs('student');
    }
    setActiveTab('raise-ticket');
  };

  const handleDirectComplaintNavigate = (loc) => {
    setScannedLocation({
      building: loc.building,
      floor: loc.floor,
      room: loc.room,
      location: `${loc.building} - Floor ${loc.floor} - Room ${loc.room}`,
    });
    if (!user) {
      quickLoginAs('student');
    }
    setActiveTab('raise-ticket');
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleRefresh = () => {
    fetchCounts();
  };

  // If not logged in, show Login page (with option for direct QR scan without login!)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <Navbar
          onOpenQRScanner={() => setShowQRScanner(true)}
          onOpenComplaintQR={() => setShowComplaintQR(true)}
          onOpenScenario={() => setShowScenarioModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
        <main className="flex-1 flex items-center justify-center">
          <Login onOpenQRScanner={() => setShowQRScanner(true)} />
        </main>

        <ComplaintQRModal
          isOpen={showComplaintQR}
          onClose={() => setShowComplaintQR(false)}
          onNavigateToComplaint={handleDirectComplaintNavigate}
        />

        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onLocationScanned={handleLocationScanned}
        />
        <ScenarioWalkthroughModal
          isOpen={showScenarioModal}
          onClose={() => setShowScenarioModal(false)}
          onRefreshData={handleRefresh}
        />
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          onRefresh={handleRefresh}
        />
      </div>
    );
  }

  const isMaintenance = user.role === 'office_staff' && user.dept?.toLowerCase().includes('maintenance');
  const isAdmin = user.role === 'admin';
  const isStudent = user.role === 'student' || (!isMaintenance && !isAdmin);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onOpenQRScanner={() => setShowQRScanner(true)}
        onOpenComplaintQR={() => setShowComplaintQR(true)}
        onOpenScenario={() => setShowScenarioModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'qr-report') {
              setShowQRScanner(true);
            } else {
              setActiveTab(tab);
            }
          }}
          counts={counts}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {isStudent && (
            <StudentDashboard
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onViewTicket={handleViewTicket}
              onOpenQRScanner={() => setShowQRScanner(true)}
              scannedLocation={scannedLocation}
              clearScannedLocation={() => setScannedLocation(null)}
            />
          )}

          {isMaintenance && (
            <MaintenanceDashboard
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onViewTicket={handleViewTicket}
            />
          )}

          {isAdmin && (
            <AdminDashboard
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onViewTicket={handleViewTicket}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <TicketDetailsModal
        isOpen={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onRefresh={() => {
          fetchCounts();
          if (selectedTicket) {
            api.getTicket(selectedTicket.ticket_id).then(t => setSelectedTicket(t)).catch(() => {});
          }
        }}
      />

      <ComplaintQRModal
        isOpen={showComplaintQR}
        onClose={() => setShowComplaintQR(false)}
        onNavigateToComplaint={handleDirectComplaintNavigate}
      />

      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onLocationScanned={handleLocationScanned}
      />

      <ScenarioWalkthroughModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        onRefreshData={handleRefresh}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}

