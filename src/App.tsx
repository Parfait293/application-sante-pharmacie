import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ProfessionalSignupPage } from './components/ProfessionalSignupPage';
import { AdminAccessPage } from './components/AdminAccessPage';
import { PharmacyPage } from './components/PharmacyPage';
import { ConsultationPage } from './components/ConsultationPage';
import { ProfilePage } from './components/ProfilePage';
import { HistoryPage } from './components/HistoryPage';
import { NotificationsPage } from './components/NotificationsPage';
import { WalletPage } from './components/WalletPage';
import { OnDutyPharmaciesPage } from './components/OnDutyPharmaciesPage';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { ProfessionalAppointmentsPage } from './components/ProfessionalAppointmentsPage';
import { ProfessionalWalletPage } from './components/ProfessionalWalletPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminUsersPage } from './components/AdminUsersPage';
import type { User, Appointment, Order, Professional } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'pharmacy' | 'consultation' | 'profile' | 'history' | 'notifications' | 'wallet' | 'on-duty-pharmacies' | 'professional-dashboard' | 'professional-appointments' | 'professional-wallet' | 'admin-dashboard' | 'admin-users' | 'admin-appointments' | 'admin-settings' | 'professional-signup' | 'admin-access'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setAppointments([]);
    setOrders([]);
    localStorage.removeItem('token');
  };

  const handleLogin = (userData: User, token?: string) => {
    setUser(userData);
    // Rediriger selon le rôle de l'utilisateur
    if (userData.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (userData.role === 'professional' && userData.professionalProfile) {
      setCurrentPage('professional-dashboard');
    } else {
      setCurrentPage('home');
    }
    // Le jeton est stocké dans localStorage par l'API
  };

  const handleSignup = (userData: User, password: string) => {
    setUser(userData);
    // Rediriger selon le rôle de l'utilisateur
    if (userData.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (userData.role === 'professional' && userData.professionalProfile) {
      setCurrentPage('professional-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleNavigateToPharmacy = () => {
    if (!user) {
      setShowAuthPrompt(true);
      // Ne plus rediriger automatiquement, laisser l'utilisateur choisir
    } else {
      setCurrentPage('pharmacy');
    }
  };

  const handleNavigateToConsultation = () => {
    if (!user) {
      setShowAuthPrompt(true);
      // Ne plus rediriger automatiquement, laisser l'utilisateur choisir
    } else {
      setCurrentPage('consultation');
    }
  };

  const handleBookAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };

  const handleAddOrder = (order: Order) => {
    setOrders([...orders, order]);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {currentPage === 'home' && (
        <HomePage
          user={user}
          onLogin={() => setCurrentPage('login')}
          onSignup={() => setCurrentPage('signup')}
          onLogout={handleLogout}
          onNavigateToPharmacy={handleNavigateToPharmacy}
          onNavigateToConsultation={handleNavigateToConsultation}
          onNavigateToProfile={() => setCurrentPage('profile')}
          onNavigateToHistory={() => setCurrentPage('history')}
          onNavigateToNotifications={() => setCurrentPage('notifications')}
          onNavigateToWallet={() => setCurrentPage('wallet')}
          onNavigateToOnDutyPharmacies={() => setCurrentPage('on-duty-pharmacies')}
          showAuthPrompt={showAuthPrompt}
          onAuthPromptClose={() => setShowAuthPrompt(false)}
          appointments={appointments}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToSignup={() => setCurrentPage('signup')}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage
          onSignup={handleSignup}
          onNavigateToLogin={() => setCurrentPage('login')}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'pharmacy' && user && (
        <PharmacyPage
          user={user}
          onBack={() => setCurrentPage('home')}
          onAddOrder={handleAddOrder}
        />
      )}
      {currentPage === 'consultation' && user && (
        <ConsultationPage
          user={user}
          onBack={() => setCurrentPage('home')}
          onBookAppointment={handleBookAppointment}
        />
      )}
      {currentPage === 'profile' && user && (
        <ProfilePage
          user={user}
          onBack={() => setCurrentPage('home')}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'history' && user && (
        <HistoryPage
          user={user}
          onBack={() => setCurrentPage('home')}
          appointments={appointments}
          orders={orders}
        />
      )}
      {currentPage === 'notifications' && user && (
        <NotificationsPage
          user={user}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'wallet' && user && (
        <WalletPage
          user={user}
          onBack={() => setCurrentPage('home')}
          onUpdateUser={setUser}
        />
      )}
      {currentPage === 'on-duty-pharmacies' && (
        <OnDutyPharmaciesPage
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'admin-dashboard' && user && user.role === 'admin' && (
        <AdminDashboard
          user={user}
          onBack={() => setCurrentPage('home')}
          onNavigateToUsers={() => setCurrentPage('admin-users')}
          onNavigateToAppointments={() => setCurrentPage('admin-appointments')}
          onNavigateToSettings={() => setCurrentPage('admin-settings')}
          onLogout={handleLogout}
        />
      )}
      {currentPage === 'admin-users' && user && user.role === 'admin' && (
        <AdminUsersPage
          user={user}
          onBack={() => setCurrentPage('admin-dashboard')}
        />
      )}
      {currentPage === 'professional-dashboard' && user && user.role === 'professional' && user.professionalProfile && (
        <ProfessionalDashboard
          user={user}
          professional={user.professionalProfile}
          onBack={() => setCurrentPage('home')}
          onNavigateToAppointments={() => setCurrentPage('professional-appointments')}
          onNavigateToWallet={() => setCurrentPage('professional-wallet')}
          onNavigateToPatientView={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'professional-appointments' && user && user.role === 'professional' && user.professionalProfile && (
        <ProfessionalAppointmentsPage
          user={user}
          professional={user.professionalProfile}
          onBack={() => setCurrentPage('professional-dashboard')}
        />
      )}
      {currentPage === 'professional-wallet' && user && user.role === 'professional' && user.professionalProfile && (
        <ProfessionalWalletPage
          professional={user.professionalProfile}
          onBack={() => setCurrentPage('professional-dashboard')}
        />
      )}
      {currentPage === 'professional-signup' && (
        <ProfessionalSignupPage
          onProfessionalSignup={handleSignup}
          onNavigateToLogin={() => setCurrentPage('login')}
          onBack={() => setCurrentPage('home')}
        />
      )}
      {currentPage === 'admin-access' && (
        <AdminAccessPage
          onAdminLogin={handleLogin}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  );
}