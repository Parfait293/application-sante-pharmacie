import { useState, useEffect } from 'react';
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
import { authAPI } from './utils/api';
import type { User, Appointment, Order, Professional } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'pharmacy' | 'consultation' | 'profile' | 'history' | 'notifications' | 'wallet' | 'on-duty-pharmacies' | 'professional-dashboard' | 'professional-appointments' | 'professional-wallet' | 'admin-dashboard' | 'admin-users' | 'admin-appointments' | 'admin-settings' | 'professional-signup' | 'admin-access'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Gestion du bouton retour du téléphone
  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      
      // Logique de navigation retour
      if (currentPage !== 'home') {
        // Déterminer la page de retour en fonction de la page actuelle
        switch (currentPage) {
          case 'login':
          case 'signup':
          case 'professional-signup':
          case 'admin-access':
          case 'on-duty-pharmacies':
            setCurrentPage('home');
            break;
          case 'pharmacy':
          case 'consultation':
          case 'profile':
          case 'history':
          case 'notifications':
          case 'wallet':
            setCurrentPage('home');
            break;
          case 'admin-dashboard':
            setCurrentPage('home');
            break;
          case 'admin-users':
            setCurrentPage('admin-dashboard');
            break;
          case 'professional-dashboard':
            setCurrentPage('home');
            break;
          case 'professional-appointments':
          case 'professional-wallet':
            setCurrentPage('professional-dashboard');
            break;
          default:
            setCurrentPage('home');
        }
      }
    };

    // Ajouter un état à l'historique pour pouvoir gérer le retour
    window.history.pushState({ page: currentPage }, '', window.location.href);
    
    // Écouter l'événement de retour
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [currentPage]);

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setAppointments([]);
    setOrders([]);
    localStorage.removeItem('token');
  };

  const handleLogin = async (identifier: string, password: string) => {
    try {
      const result = await authAPI.login({ identifier, password });
      if (result.user) {
        setUser(result.user);
        // Rediriger selon le rôle de l'utilisateur
        if (result.user.role === 'admin') {
          setCurrentPage('admin-dashboard');
        } else if (result.user.role === 'professional' && result.user.professionalProfile) {
          setCurrentPage('professional-dashboard');
        } else {
          setCurrentPage('home');
        }
        // Le jeton est stocké dans localStorage par l'API
      } else {
        alert(result.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Erreur de connexion');
    }
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

  const handleAdminLogin = async (user: User) => {
    setUser(user);
    // Rediriger selon le rôle de l'utilisateur
    if (user.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (user.role === 'professional' && user.professionalProfile) {
      setCurrentPage('professional-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleNavigateToAdminAccess = () => {
    setCurrentPage('admin-access');
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
          onNavigateToAdminAccess={handleNavigateToAdminAccess}
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
          onAdminLogin={handleAdminLogin}
          onBack={() => setCurrentPage('home')}
        />
      )}
    </div>
  );
}