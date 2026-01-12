import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { PharmacyPage } from './components/PharmacyPage';
import { ConsultationPage } from './components/ConsultationPage';
import { ProfilePage } from './components/ProfilePage';
import { HistoryPage } from './components/HistoryPage';
import { NotificationsPage } from './components/NotificationsPage';
import { WalletPage } from './components/WalletPage';
import { OnDutyPharmaciesPage } from './components/OnDutyPharmaciesPage';
import type { User, Appointment, Order } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'pharmacy' | 'consultation' | 'profile' | 'history' | 'notifications' | 'wallet' | 'on-duty-pharmacies'>('home');
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
    setCurrentPage('home');
    // Token is stored in localStorage by the API
  };

  const handleSignup = (userData: User, password: string) => {
    setUser(userData);
    setCurrentPage('home');
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
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
}