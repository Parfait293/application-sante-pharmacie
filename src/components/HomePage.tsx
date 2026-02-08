import { User, X, Pill, Stethoscope, ChevronRight, MapPin, Clock, Bell, History, Settings, Wallet, Shield } from 'lucide-react';
import type { User as UserType } from '../types';
import type { Appointment } from '../types';
import { Logo } from './Logo';

type HomePageProps = {
  user: UserType | null;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  onNavigateToPharmacy: () => void;
  onNavigateToConsultation: () => void;
  onNavigateToProfile: () => void;
  onNavigateToHistory: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToWallet: () => void;
  onNavigateToOnDutyPharmacies: () => void;
  onNavigateToAdminAccess: () => void;
  showAuthPrompt: boolean;
  onAuthPromptClose: () => void;
  appointments: Appointment[];
};

export function HomePage({
  user,
  onLogin,
  onSignup,
  onLogout,
  onNavigateToPharmacy,
  onNavigateToConsultation,
  onNavigateToProfile,
  onNavigateToHistory,
  onNavigateToNotifications,
  onNavigateToWallet,
  onNavigateToOnDutyPharmacies,
  onNavigateToAdminAccess,
  showAuthPrompt,
  onAuthPromptClose,
  appointments
}: HomePageProps) {
  const pharmacies = [
    {
      name: 'Pharmacie Centrale',
      address: '12 Avenue de la République',
      image: 'https://images.unsplash.com/photo-1760307837671-63ee641f9f1c?w=800&h=600&fit=crop',
      open: true
    },
    {
      name: 'Pharmacie de Garde',
      address: '45 Rue du Commerce',
      image: 'https://images.unsplash.com/photo-1760307837671-63ee641f9f1c?w=800&h=600&fit=crop',
      open: true
    },
    {
      name: 'Pharmacie Saint-Michel',
      address: '8 Boulevard Victor Hugo',
      image: 'https://images.unsplash.com/photo-1760307837671-63ee641f9f1c?w=800&h=600&fit=crop',
      open: false
    }
  ];

  const doctors = [
    {
      name: 'Clinique Espoir',
      specialty: 'Centre Médical Généraliste',
      image: 'https://images.unsplash.com/photo-1662414185445-b9a05e26dba0?w=400&h=400&fit=crop',
      available: true
    },
    {
      name: 'Centre Cardiologique',
      specialty: 'Cardiologie & Chirurgie',
      image: 'https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?w=400&h=400&fit=crop',
      available: true
    },
    {
      name: 'CMS Pédiatrique',
      specialty: 'Pédiatrie & Maternité',
      image: 'https://images.unsplash.com/photo-1732376800645-c066f9e283e8?w=400&h=400&fit=crop',
      available: false
    },
    {
      name: 'Clinique Dermatologie Plus',
      specialty: 'Dermatologie & Esthétique',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop',
      available: true
    }
  ];

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-white pb-20 max-w-screen min-h-screen overflow-x-hidden">
      {/* Header avec logo et profil */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 shadow-lg px-4 sm:px-6 pt-8 pb-6 rounded-b-3xl w-full">
        {/* Logo */}
        <div className="mb-6">
          <Logo size="md" variant="white" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <button onClick={user ? onNavigateToProfile : onLogin}>
              <div className="flex-shrink-0 bg-white rounded-full ring-4 ring-white/30 hover:ring-white/50 w-14 sm:w-16 h-14 sm:h-16 overflow-hidden transition-all">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex justify-center items-center bg-gradient-to-br from-cyan-400 to-purple-500 w-full h-full">
                    <User className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                )}
              </div>
            </button>
            <div className="flex-1 min-w-0">
              {user ? (
                <>
                  <p className="font-medium text-white/90 text-sm sm:text-base truncate">Bonjour,</p>
                  <p className="font-semibold text-white text-lg sm:text-xl truncate">{user.prenom} {user.nom}</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-white/90 text-sm sm:text-base">Bienvenue sur</p>
                  <p className="font-semibold text-white text-lg sm:text-xl">Ma Santé</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-shrink-0 items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={onNavigateToNotifications}
                  className="relative flex justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-8 sm:w-10 h-8 sm:h-10 transition-colors"
                >
                  <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  <span className="top-1 right-1 absolute bg-red-500 border-2 border-white rounded-full w-3 h-3"></span>
                </button>
                <button
                  onClick={onLogout}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2 rounded-full text-white text-xs sm:text-sm transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="bg-white hover:bg-white/90 px-3 sm:px-4 py-2 sm:py-2 rounded-full text-cyan-600 text-xs sm:text-sm transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={onSignup}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2 rounded-full text-white text-xs sm:text-sm transition-colors"
                >
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>

        {/* Menus principaux */}
        <div className="gap-3 sm:gap-4 grid grid-cols-2 mt-6">
          <button
            onClick={onNavigateToPharmacy}
            className="bg-white shadow-lg hover:shadow-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl active:scale-95 transition-all"
          >
            <div className="flex justify-center items-center bg-gradient-to-br from-cyan-400 to-teal-600 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl w-12 sm:w-14 h-12 sm:h-14">
              <Pill className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
            </div>
            <p className="text-gray-800 text-sm sm:text-base text-center">Pharmacie</p>
            <p className="mt-1 text-gray-500 text-xs sm:text-sm text-center">Rechercher un médicament</p>
          </button>

          <button
            onClick={onNavigateToConsultation}
            className="bg-white shadow-lg hover:shadow-xl p-4 sm:p-6 rounded-xl sm:rounded-2xl active:scale-95 transition-all"
          >
            <div className="flex justify-center items-center bg-gradient-to-br from-purple-400 to-indigo-600 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl w-12 sm:w-14 h-12 sm:h-14">
              <Stethoscope className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
            </div>
            <p className="text-gray-800 text-sm sm:text-base text-center">Consultation</p>
            <p className="mt-1 text-gray-500 text-xs sm:text-sm text-center">Prendre rendez-vous</p>
          </button>
        </div>
      </div>

      {/* Prochains rendez-vous */}
      {user && upcomingAppointments.length > 0 && (
        <div className="mt-6 px-6">
          <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 shadow-lg p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white">Prochain rendez-vous</h3>
              <button 
                onClick={onNavigateToHistory}
                className="text-white/80 hover:text-white text-sm"
              >
                Voir tout
              </button>
            </div>
            {upcomingAppointments.slice(0, 1).map((apt) => (
              <div key={apt.id} className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={apt.professional.image}
                    alt={apt.professional.name}
                    className="rounded-lg ring-2 ring-white/30 w-12 h-12 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white">{apt.professional.name}</p>
                    <p className="text-white/80 text-sm">{apt.professional.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{new Date(apt.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu rapide */}
      {user && (
        <div className="mt-6 px-6">
          <div className="gap-3 grid grid-cols-4">
            <button
              onClick={onNavigateToProfile}
              className="bg-white shadow-md hover:shadow-lg p-4 rounded-xl active:scale-95 transition-all"
            >
              <div className="flex justify-center items-center bg-gradient-to-br from-purple-400 to-purple-600 mx-auto mb-2 rounded-lg w-10 h-10">
                <User className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Profil</p>
            </button>

            <button
              onClick={onNavigateToHistory}
              className="bg-white shadow-md hover:shadow-lg p-4 rounded-xl active:scale-95 transition-all"
            >
              <div className="flex justify-center items-center bg-gradient-to-br from-orange-400 to-orange-600 mx-auto mb-2 rounded-lg w-10 h-10">
                <History className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Historique</p>
            </button>

            <button
              onClick={onNavigateToWallet}
              className="bg-white shadow-md hover:shadow-lg p-4 rounded-xl active:scale-95 transition-all"
            >
              <div className="flex justify-center items-center bg-gradient-to-br from-green-400 to-green-600 mx-auto mb-2 rounded-lg w-10 h-10">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Porte­feuille</p>
            </button>

            <button
              onClick={onNavigateToNotifications}
              className="relative bg-white shadow-md hover:shadow-lg p-4 rounded-xl active:scale-95 transition-all"
            >
              <div className="flex justify-center items-center bg-gradient-to-br from-red-400 to-red-600 mx-auto mb-2 rounded-lg w-10 h-10">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Alertes</p>
              <span className="top-2 right-2 absolute bg-red-500 rounded-full w-2 h-2"></span>
            </button>
          </div>

          {/* Bouton d'accès admin caché */}
          {onNavigateToAdminAccess && (
            <div className="mt-4">
              <button
                onClick={onNavigateToAdminAccess}
                className="bg-gray-800 hover:bg-gray-900 opacity-50 hover:opacity-100 p-3 rounded-xl w-full text-white text-xs transition-colors"
              >
                Accès Admin
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pharmacies de Garde (accessible à tous) */}
      <div className="mt-6 px-6">
        <button
          onClick={onNavigateToOnDutyPharmacies}
          className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg hover:shadow-xl p-5 rounded-2xl w-full active:scale-95 transition-all"
        >
          <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm rounded-xl w-14 h-14">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white">Pharmacies de Garde</p>
            <p className="mt-1 text-white/80 text-sm">Ouvertes 24h/24</p>
          </div>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Section Cliniques et CMS */}
      <div className="mt-8 px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800">Cliniques & Centres Médicaux</h2>
          <button 
            onClick={onNavigateToConsultation}
            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm transition-colors"
          >
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-white shadow-md hover:shadow-lg p-4 rounded-2xl transition-shadow"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="rounded-xl w-20 h-20 object-cover"
              />
              <div className="flex-1">
                <h3 className="mb-1 text-gray-800">{doctor.name}</h3>
                <p className="mb-2 text-gray-600 text-sm">{doctor.specialty}</p>
                {doctor.available ? (
                  <div className="flex items-center gap-1 text-cyan-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Disponible aujourd'hui</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Non disponible</span>
                  </div>
                )}
              </div>
              <button 
                onClick={onNavigateToConsultation}
                className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 hover:shadow-md px-4 py-2 rounded-full text-white transition-shadow"
              >
                Consulter
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt d'authentification */}
      {showAuthPrompt && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 px-6">
          <div className="bg-white shadow-2xl p-8 rounded-3xl w-full max-w-sm animate-in duration-200 fade-in zoom-in">
            <div className="flex justify-between items-start mb-4">
              <div className="flex justify-center items-center bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl w-16 h-16">
                <User className="w-8 h-8 text-white" />
              </div>
              <button
                onClick={onAuthPromptClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <h3 className="mb-2 text-gray-800">Connexion requise</h3>
            <p className="mb-6 text-gray-600">
              Veuillez vous connecter ou créer un compte pour accéder à cette fonctionnalité.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onAuthPromptClose();
                  onLogin();
                }}
                className="flex-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 hover:shadow-lg py-3 rounded-xl text-white transition-shadow"
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  onAuthPromptClose();
                  onSignup();
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 rounded-xl text-gray-700 transition-colors"
              >
                S'inscrire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}