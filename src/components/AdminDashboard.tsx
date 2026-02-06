import { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendingUp, Calendar, ShoppingCart, DollarSign, Activity, Shield, Settings, LogOut, UserCheck, UserX, Clock, Star } from 'lucide-react';
import type { User, AdminStats, AdminUser, AdminAppointment } from '../types';
import { Logo } from './Logo';

// API Admin (à ajouter dans utils/api.ts plus tard)
const adminAPI = {
  getStats: async () => {
    // Simulation pour le moment
    return {
      stats: {
        totalUsers: 1520,
        totalProfessionals: 48,
        totalAppointments: 342,
        totalOrders: 892,
        totalRevenue: 8500000,
        monthlyGrowth: 12.5
      }
    };
  },
  getRecentUsers: async () => {
    // Simulation
    return {
      users: [
        {
          id: '1',
          nom: 'Koffi',
          prenom: 'Yao',
          telephone: '+22890123456',
          email: 'koffi.yao@email.com',
          role: 'patient' as const,
          isActive: true,
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20'
        },
        {
          id: '2',
          nom: 'Aho',
          prenom: 'Komi',
          telephone: '+22891234567',
          email: 'aho.komi@email.com',
          role: 'professional' as const,
          isActive: true,
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19'
        }
      ]
    };
  },
  getRecentAppointments: async () => {
    // Simulation
    return {
      appointments: [
        {
          id: '1',
          patient: 'Koffi Yao',
          professional: 'Dr. Aho Komi',
          date: '2024-01-20',
          time: '10:00',
          status: 'completed' as const,
          consultationFee: 5000,
          isPaid: true
        },
        {
          id: '2',
          patient: 'Aya Bako',
          professional: 'Dr. Mensah Akossiwa',
          date: '2024-01-21',
          time: '14:30',
          status: 'upcoming' as const,
          consultationFee: 7500,
          isPaid: false
        }
      ]
    };
  }
};

type AdminDashboardProps = {
  user: User;
  onBack: () => void;
  onNavigateToUsers: () => void;
  onNavigateToAppointments: () => void;
  onNavigateToSettings: () => void;
  onLogout: () => void;
};

export function AdminDashboard({ 
  user, 
  onBack, 
  onNavigateToUsers, 
  onNavigateToAppointments, 
  onNavigateToSettings,
  onLogout 
}: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProfessionals: 0,
    totalAppointments: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<AdminAppointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, usersResponse, appointmentsResponse] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getRecentUsers(),
        adminAPI.getRecentAppointments()
      ]);

      setStats(statsResponse.stats);
      setRecentUsers(usersResponse.users);
      setRecentAppointments(appointmentsResponse.appointments);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: number;
  }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{trend > 0 ? '+' : ''}{trend}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black px-6 pt-8 pb-24 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="white" />
            <button 
              onClick={onLogout}
              className="text-white/80 hover:text-white flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
        
        <div className="text-white">
          <h1 className="text-3xl mb-2">Tableau de bord Admin</h1>
          <p className="text-white/80">Gérez l'application Santé Pharmacie</p>
        </div>
      </div>

      <div className="px-6 -mt-16">
        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="bg-blue-500"
            trend={stats.monthlyGrowth}
          />
          <StatCard
            title="Professionnels"
            value={stats.totalProfessionals}
            icon={Shield}
            color="bg-purple-500"
            trend={8.2}
          />
          <StatCard
            title="Rendez-vous"
            value={stats.totalAppointments.toLocaleString()}
            icon={Calendar}
            color="bg-cyan-500"
            trend={15.3}
          />
          <StatCard
            title="Commandes"
            value={stats.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            color="bg-green-500"
            trend={12.1}
          />
        </div>

        {/* Revenus et croissance */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <StatCard
            title="Revenus totaux"
            value={`${stats.totalRevenue.toLocaleString()} FCFA`}
            icon={DollarSign}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            trend={stats.monthlyGrowth}
          />
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-gray-800 font-semibold mb-4">Actions rapides</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onNavigateToUsers}
              className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center gap-2"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-sm text-gray-700">Utilisateurs</span>
            </button>
            
            <button
              onClick={onNavigateToAppointments}
              className="p-4 bg-cyan-50 rounded-xl hover:bg-cyan-100 transition-colors flex flex-col items-center gap-2"
            >
              <Calendar className="w-6 h-6 text-cyan-600" />
              <span className="text-sm text-gray-700">Rendez-vous</span>
            </button>
            
            <button
              onClick={onNavigateToSettings}
              className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors flex flex-col items-center gap-2"
            >
              <Settings className="w-6 h-6 text-purple-600" />
              <span className="text-sm text-gray-700">Paramètres</span>
            </button>
            
            <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors flex flex-col items-center gap-2">
              <Activity className="w-6 h-6 text-green-600" />
              <span className="text-sm text-gray-700">Rapports</span>
            </button>
          </div>
        </div>

        {/* Utilisateurs récents */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold">Utilisateurs récents</h3>
            <button 
              onClick={onNavigateToUsers}
              className="text-blue-600 text-sm hover:underline"
            >
              Voir tout
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-purple-100' :
                      user.role === 'professional' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {user.role === 'admin' ? <Shield className="w-4 h-4 text-purple-600" /> :
                       user.role === 'professional' ? <UserCheck className="w-4 h-4 text-blue-600" /> :
                       <Users className="w-4 h-4 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.prenom} {user.nom}</p>
                      <p className="text-sm text-gray-600">{user.email || user.telephone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'professional' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'admin' ? 'Admin' :
                       user.role === 'professional' ? 'Pro' : 'Patient'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rendez-vous récents */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold">Rendez-vous récents</h3>
            <button 
              onClick={onNavigateToAppointments}
              className="text-cyan-600 text-sm hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">avec {appointment.professional}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString('fr-FR')} • {appointment.time}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    appointment.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {appointment.status === 'completed' ? 'Terminé' :
                     appointment.status === 'upcoming' ? 'À venir' : 'Annulé'}
                  </span>
                  <div className="flex items-center gap-1">
                    {appointment.isPaid ? (
                      <DollarSign className="w-4 h-4 text-green-500" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {appointment.consultationFee.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
