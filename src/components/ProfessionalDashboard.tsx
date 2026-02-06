import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, TrendingUp, Wallet, Clock, CheckCircle, XCircle, Star, MessageSquare, Video, Phone } from 'lucide-react';
import type { User, Professional, ProfessionalAppointment } from '../types';
import { Logo } from './Logo';
import { professionalAPI } from '../utils/api';

type ProfessionalDashboardProps = {
  user: User;
  professional: Professional;
  onBack: () => void;
  onNavigateToAppointments: () => void;
  onNavigateToWallet: () => void;
  onNavigateToPatientView: () => void; // Pour utiliser l'app comme patient
};

export function ProfessionalDashboard({ 
  user, 
  professional, 
  onBack, 
  onNavigateToAppointments, 
  onNavigateToWallet,
  onNavigateToPatientView 
}: ProfessionalDashboardProps) {
  const [appointments, setAppointments] = useState<ProfessionalAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weekAppointments: 0,
    monthEarnings: 0,
    totalPatients: 0,
    rating: professional.rating || 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await professionalAPI.getAppointments();
      if (response.appointments) {
        setAppointments(response.appointments);
        
        // Calculer les statistiques
        const today = new Date().toISOString().split('T')[0];
        const todayApps = response.appointments.filter((app: ProfessionalAppointment) => 
          app.date === today && app.status === 'upcoming'
        ).length;
        
        const weekApps = response.appointments.filter((app: ProfessionalAppointment) => {
          const appDate = new Date(app.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return appDate >= weekAgo && app.status === 'completed';
        }).length;

        const monthEarnings = response.appointments
          .filter((app: ProfessionalAppointment) => {
            const appDate = new Date(app.date);
            const thisMonth = new Date();
            return appDate.getMonth() === thisMonth.getMonth() && 
                   appDate.getFullYear() === thisMonth.getFullYear() &&
                   app.status === 'completed' && app.isPaid;
          })
          .reduce((sum: number, app: ProfessionalAppointment) => sum + (app.consultationFee || 0), 0);

        setStats(prev => ({
          ...prev,
          todayAppointments: todayApps,
          weekAppointments: weekApps,
          monthEarnings,
          totalPatients: new Set(response.appointments.map((app: ProfessionalAppointment) => app.patient.id)).size
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(app => app.status === 'upcoming')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-24 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <Logo size="sm" variant="white" />
        </div>
        
        <div className="text-white">
          <h1 className="text-2xl mb-2">Tableau de bord</h1>
          <p className="text-white/80">Bienvenue Dr. {professional.name}</p>
          <p className="text-white/60 text-sm mt-1">{professional.specialty}</p>
        </div>
      </div>

      <div className="px-6 -mt-16">
        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Aujourd'hui</p>
                <p className="text-xl font-bold text-gray-800">{stats.todayAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Ce mois</p>
                <p className="text-xl font-bold text-gray-800">{stats.monthEarnings.toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Patients</p>
                <p className="text-xl font-bold text-gray-800">{stats.totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-xs">Note</p>
                <p className="text-xl font-bold text-gray-800">{stats.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-gray-800 font-semibold mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onNavigateToAppointments}
              className="p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors"
            >
              <Calendar className="w-6 h-6 text-cyan-600 mb-2" />
              <p className="text-sm text-gray-700">Mes RDV</p>
            </button>
            
            <button
              onClick={onNavigateToWallet}
              className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Wallet className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-700">Portefeuille</p>
            </button>
            
            <button
              onClick={onNavigateToPatientView}
              className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <Users className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm text-gray-700">Vue Patient</p>
            </button>
            
            <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-gray-700">Messages</p>
            </button>
          </div>
        </div>

        {/* Prochains rendez-vous */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold">Prochains rendez-vous</h3>
            <button 
              onClick={onNavigateToAppointments}
              className="text-cyan-600 text-sm hover:underline"
            >
              Voir tout
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{appointment.patient.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('fr-FR')} • {appointment.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {appointment.type === 'video' && <Video className="w-4 h-4 text-blue-500" />}
                        {appointment.type === 'domicile' && <Phone className="w-4 h-4 text-green-500" />}
                        {appointment.type === 'cabinet' && <Users className="w-4 h-4 text-purple-500" />}
                        <span className="text-sm text-gray-600 capitalize">{appointment.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {appointment.isPaid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Aucun rendez-vous à venir</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
