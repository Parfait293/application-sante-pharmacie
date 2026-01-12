// src/pages/ConsultationPage.tsx
import React, { useState, useMemo } from 'react';
import type { User as AppUser } from '../types';
import '../styles/pages.css';
import { ArrowLeft, Phone, Home, User, MessageSquare, Search, Star } from 'lucide-react';
import {
  DUMMY_PROFESSIONALS,
  HEALTH_SPECIALTIES,
  Professional,
  ConsultationMode,
  AppScreen,
  AuthPromptModal,
  // removed placeholder wallet/appointment from utils in favor of dedicated components
} from '../utils/baseComponents';
import CallModal from './CallModal';
import BookingModal from './BookingModal';

interface ConsultationPageProps {
  onBack: () => void;
  user?: AppUser | null;
  onNavigate?: (screen: AppScreen) => void;
  onBookAppointment?: (appointment: any) => void;
}

export function ConsultationPage({ onBack, user, onNavigate }: ConsultationPageProps) {
  const isLoggedIn = Boolean(user);
  const [selectedMode, setSelectedMode] = useState<ConsultationMode>('enLigne');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Généraliste');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(user?.walletBalance ?? 20000);
  const [lockedHolds, setLockedHolds] = useState<Record<string, number>>({});
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const filteredProfessionals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    // If user typed a search query, search across all professionals (ignoring availability)
    if (q !== '') {
      return [...DUMMY_PROFESSIONALS]
        .filter(prof => {
          const matchesSpecialty = selectedSpecialty === 'Toutes' || prof.specialty === selectedSpecialty;
          const matchesQuery = prof.name.toLowerCase().includes(q) || prof.specialty.toLowerCase().includes(q);
          return matchesSpecialty && matchesQuery;
        })
        .sort((a, b) => (a.isPremium === b.isPremium ? 0 : a.isPremium ? -1 : 1));
    }

    // By default (no search query) show only professionals currently available for the selected mode
    return [...DUMMY_PROFESSIONALS]
      .filter(prof => {
        const matchesSpecialty = selectedSpecialty === 'Toutes' || prof.specialty === selectedSpecialty;
        const matchesAvailability = Boolean(prof.available);
        return matchesSpecialty && matchesAvailability;
      })
      .sort((a, b) => (a.isPremium === b.isPremium ? 0 : a.isPremium ? -1 : 1));
  }, [searchQuery, selectedSpecialty]);

  const handleProfessionalSelect = (prof: Professional) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!prof.available && (selectedMode === 'enLigne' || selectedMode === 'domicile')) {
      alert(`${prof.name} est actuellement indisponible pour ce mode.`);
      return;
    }

    setSelectedProfessional(prof);
    // Open the appropriate modal depending on mode
    if (selectedMode === 'enLigne') {
      setIsCallModalOpen(true);
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleLaunchCallOrService = () => {
    setTimeout(() => {
      const confirmed = window.confirm('La consultation est terminée ? Confirmez pour débloquer le paiement.');
      if (confirmed) {
        // simulate release of funds
        if (selectedProfessional) {
          const key = String(selectedProfessional.id);
          const hold = lockedHolds[key] ?? 0;
          if (hold > 0) {
            // release: in real app transfer to professional; here we remove lock
            setLockedHolds(prev => { const c = { ...prev }; delete c[key]; return c; });
            setNotifications(prev => [`Paiement de ${hold} FCFA envoyé à ${selectedProfessional.name}.`, ...prev]);
            alert(`Paiement transféré à ${selectedProfessional?.name ?? 'le professionnel'}.`);
          } else {
            alert('Aucun montant bloqué pour ce professionnel.');
          }
        }
      } else {
        alert('Paiement maintenu gelé.');
      }
    }, 3000);
  };
  const holdConsultationFee = (profId: string | number, amount: number) => {
    if (walletBalance < amount) return { ok: false, reason: 'solde insuffisant' };
    const key = String(profId);
    setWalletBalance(prev => prev - amount);
    setLockedHolds(prev => ({ ...prev, [key]: (prev[key] ?? 0) + amount }));
    setNotifications(prev => [`${amount} FCFA réservés pour la consultation.`, ...prev]);
    return { ok: true };
  };

  const releaseHoldFor = (profId: string | number) => {
    const key = String(profId);
    const amount = lockedHolds[key] ?? 0;
    if (amount <= 0) return { ok: false };
    setLockedHolds(prev => { const c = { ...prev }; delete c[key]; return c; });
    setNotifications(prev => [`${amount} FCFA débloqués et envoyés au professionnel.`, ...prev]);
    return { ok: true, amount };
  };

  const addNotification = (msg: string) => setNotifications(prev => [msg, ...prev]);

  const ProfessionalCard: React.FC<{ prof: Professional }> = ({ prof }) => {
    const isPremiumWithName = prof.isPremium && selectedMode !== 'cabinet';
    const displayName = isPremiumWithName ? prof.name : prof.clinicName;
    const displaySubtitle = isPremiumWithName ? prof.clinicName : prof.specialty;
    const isImmediateUnavailable = !prof.available && (selectedMode === 'enLigne' || selectedMode === 'domicile');

    const actionLabel = (() => {
      switch (selectedMode) {
        case 'enLigne': return 'Appeler / Visio';
        case 'domicile': return 'RDV Domicile';
        case 'cabinet': return 'Prendre RDV';
        case 'professionnelDuMetier': return 'Contacter Pro.';
        default: return 'Contacter';
      }
    })();

    return (
      <div
        onClick={() => { if (!isImmediateUnavailable) handleProfessionalSelect(prof); }}
        className={`w-full bg-white rounded-xl shadow-md p-4 flex items-center gap-4 transition cursor-pointer ${isImmediateUnavailable ? 'opacity-70 cursor-not-allowed border-l-4 border-red-500' : 'border-l-4 border-transparent hover:border-teal-500'}`}
      >
        <div className={`avatar-wrap ${selectedMode} ${prof.available ? 'available' : 'unavailable'} ${prof.isPremium ? 'premium' : ''}`}>
          {prof.imageUrl ? (
            // image may have transparent background; we keep a colored ring on wrapper
            <img src={prof.imageUrl} alt={prof.name} className="card-avatar-img" />
          ) : (
            <div className="avatar-initials">{prof.name?.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()}</div>
          )}
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800">{prof.name}</div>
              <div className="text-sm text-gray-500">{prof.specialty} • {prof.clinicName}</div>
              {prof.schedule && prof.schedule.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">Horaire: {prof.schedule.slice(0,2).join(' • ')}</div>
              )}
              {prof.clinics && prof.clinics.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {prof.clinics.slice(0,2).map(c => (
                    <span key={c.id} className="px-2 py-0.5 bg-gray-100 text-xs rounded">{c.name}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">{prof.rating} <Star className="inline w-3 h-3" /></div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-sm font-medium">{prof.consultationFee.toFixed(2)} FCFA</div>
            <div className={`text-xs ${prof.available ? 'text-teal-600' : 'text-red-500'}`}>• {prof.available ? 'Disponible' : 'Indisponible'}</div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {prof.isPremium && <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">Premium</span>}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isImmediateUnavailable) {
                if (!isLoggedIn) setIsAuthModalOpen(true);
                else handleProfessionalSelect(prof);
              } else {
                // If unavailable but user is logged show friendly message
                if (!isLoggedIn) setIsAuthModalOpen(true);
                else alert(`${prof.name} est actuellement indisponible pour ce mode.`);
              }
            }}
            className={`px-3 py-1 rounded-lg text-sm ${isImmediateUnavailable ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-teal-500 text-white'}`}
            aria-disabled={isImmediateUnavailable}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-white flex items-center gap-2 hover:opacity-80 transition">
            <ArrowLeft className="w-5 h-5" /> <span>Retour</span>
          </button>
          <h1 className="text-white text-2xl font-bold">Consultations</h1>
          <div />
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <div className="flex gap-3">
          {([
            { key: 'enLigne', label: 'En Ligne', icon: Phone },
            { key: 'domicile', label: 'Domicile', icon: Home },
            { key: 'cabinet', label: 'Cabinet', icon: User },
            { key: 'professionnelDuMetier', label: 'Pro. Métier', icon: MessageSquare }
          ] as { key: ConsultationMode; label: string; icon: any }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedMode(key)}
              aria-pressed={selectedMode === key}
              className={`mode-button flex-1 py-3 rounded-xl font-medium transition flex flex-col items-center justify-center gap-1 ${selectedMode === key ? 'active' : ''}`}
            >
              <Icon className={`w-5 h-5 ${selectedMode === key ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 bg-white rounded-xl shadow">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou spécialité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input pl-10"
                autoFocus={false}
              />
            </div>

            <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="px-3 py-2 border rounded-xl">
              <option value="Toutes">Toutes</option>
              {HEALTH_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredProfessionals.map(prof => <ProfessionalCard key={prof.id} prof={prof} />)}

          {filteredProfessionals.length === 0 && (
            searchQuery.trim() !== '' ? (
              <div className="p-4 text-center text-gray-500 border border-dashed rounded-xl">Aucun professionnel trouvé pour votre recherche.</div>
            ) : (
              <div className="p-4 text-center text-gray-600 border border-dashed rounded-xl">
                <div className="font-medium mb-2">Aucun professionnel disponible pour ce mode.</div>
                <div className="text-sm mb-3">Essayez de rechercher un nom ou une spécialité dans la barre ci‑dessus pour trouver d'autres professionnels.</div>
                <div className="text-xs text-gray-500">Vous pouvez aussi basculer le mode pour voir d'autres disponibilités.</div>
              </div>
            )
          )}
        </div>
      </div>

      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => { setIsAuthModalOpen(false); onNavigate?.('login'); }}
        onRegister={() => { setIsAuthModalOpen(false); onNavigate?.('registration'); }}
      />

      {selectedProfessional && (
        <>
            <CallModal
              professional={selectedProfessional}
              isOpen={isCallModalOpen}
              onClose={() => setIsCallModalOpen(false)}
              walletBalance={walletBalance}
              lockedAmount={selectedProfessional ? (lockedHolds[String(selectedProfessional.id)] ?? 0) : 0}
              onHoldPayment={(profId, amount) => {
                return holdConsultationFee(profId, amount);
              }}
              onConfirmComplete={(profId) => {
                const res = releaseHoldFor(profId);
                if (res.ok) {
                  addNotification(`Paiement de ${res.amount} FCFA envoyé au professionnel.`);
                }
              }}
            />          <BookingModal
            professional={selectedProfessional}
            mode={selectedMode}
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            onBook={(data) => {
              console.log('booking data', data);
              addNotification(`Rendez-vous demandé pour ${data.professional?.name || data.professional?.clinicName} le ${data.date} à ${data.time}`);
            }}
          />
        </>
      )}
    </div>
  );
}