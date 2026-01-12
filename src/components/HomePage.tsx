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
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-20">
      {/* Header avec logo et profil */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        {/* Logo */}
        <div className="mb-6">
          <Logo size="md" variant="white" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={user ? onNavigateToProfile : onLogin}>
              <div className="w-16 h-16 rounded-full bg-white overflow-hidden ring-4 ring-white/30 hover:ring-white/50 transition-all">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-purple-500">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            </button>
            <div className="flex-1">
              {user ? (
                <>
                  <p className="text-white/90 text-sm">Bonjour,</p>
                  <p className="text-white">{user.prenom} {user.nom}</p>
                </>
              ) : (
                <>
                  <p className="text-white/90 text-sm">Bienvenue sur</p>
                  <p className="text-white">Ma Santé</p>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={onNavigateToNotifications}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm relative"
                >
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-sm text-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 bg-white text-cyan-600 rounded-full hover:bg-white/90 transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={onSignup}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>

        {/* Menus principaux */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={onNavigateToPharmacy}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <p className="text-gray-800 text-center">Pharmacie</p>
            <p className="text-gray-500 text-sm text-center mt-1">Rechercher un médicament</p>
          </button>

          <button
            onClick={onNavigateToConsultation}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <p className="text-gray-800 text-center">Consultation</p>
            <p className="text-gray-500 text-sm text-center mt-1">Prendre rendez-vous</p>
          </button>
        </div>
      </div>

      {/* Prochains rendez-vous */}
      {user && upcomingAppointments.length > 0 && (
        <div className="px-6 mt-6">
          <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white">Prochain rendez-vous</h3>
              <button 
                onClick={onNavigateToHistory}
                className="text-white/80 hover:text-white text-sm"
              >
                Voir tout
              </button>
            </div>
            {upcomingAppointments.slice(0, 1).map((apt) => (
              <div key={apt.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={apt.professional.image}
                    alt={apt.professional.name}
                    className="w-12 h-12 rounded-lg object-cover ring-2 ring-white/30"
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
        <div className="px-6 mt-6">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={onNavigateToProfile}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <User className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Profil</p>
            </button>

            <button
              onClick={onNavigateToHistory}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <History className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Historique</p>
            </button>

            <button
              onClick={onNavigateToWallet}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Porte­feuille</p>
            </button>

            <button
              onClick={onNavigateToNotifications}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95 relative"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <p className="text-gray-700 text-sm text-center">Alertes</p>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      )}

      {/* Pharmacies de Garde (accessible à tous) */}
      <div className="px-6 mt-6">
        <button
          onClick={onNavigateToOnDutyPharmacies}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white">Pharmacies de Garde</p>
            <p className="text-white/80 text-sm mt-1">Ouvertes 24h/24</p>
          </div>
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Section Cliniques et CMS */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800">Cliniques & Centres Médicaux</h2>
          <button className="text-purple-600 text-sm flex items-center gap-1">
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="text-gray-800 mb-1">{doctor.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{doctor.specialty}</p>
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
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-full hover:shadow-md transition-shadow"
              >
                Consulter
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt d'authentification */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <button
                onClick={onAuthPromptClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <h3 className="text-gray-800 mb-2">Connexion requise</h3>
            <p className="text-gray-600 mb-6">
              Veuillez vous connecter ou créer un compte pour accéder à cette fonctionnalité.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onAuthPromptClose();
                  onLogin();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow"
              >
                Se connecter
              </button>
              <button
                onClick={() => {
                  onAuthPromptClose();
                  onSignup();
                }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
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