import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, Filter, UserCheck, UserX, Shield, Mail, Phone, Calendar, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import type { User, AdminUser } from '../types';
import { Logo } from './Logo';

// API Admin (à déplacer dans utils/api.ts)
const adminAPI = {
  getUsers: async (params?: { page?: number; limit?: number; role?: string; search?: string }) => {
    // Simulation pour le moment
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
          lastLogin: '2024-01-19',
          professionalProfile: {
            id: 'prof1',
            userId: '2',
            name: 'Dr. Aho Komi',
            clinicName: 'Cabinet Médical Lomé',
            specialty: 'Médecin généraliste',
            image: '',
            available: true,
            rating: 4.8,
            isPremium: true,
            address: 'Lomé, Togo',
            phone: '+22891234567',
            consultationFee: 5000,
            workSchedule: [],
            verified: true
          }
        },
        {
          id: '3',
          nom: 'Bako',
          prenom: 'Aya',
          telephone: '+22892345678',
          email: 'bako.aya@email.com',
          role: 'patient' as const,
          isActive: false,
          createdAt: '2024-01-08',
          lastLogin: '2024-01-15'
        }
      ],
      total: 1520,
      page: 1,
      totalPages: 152
    };
  },
  toggleUserStatus: async (userId: string) => {
    // Simulation
    return { success: true };
  },
  deleteUser: async (userId: string) => {
    // Simulation
    return { success: true };
  }
};

type AdminUsersPageProps = {
  user: User;
  onBack: () => void;
};

export function AdminUsersPage({ user, onBack }: AdminUsersPageProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'patient' | 'professional' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined
      });
      setUsers(response.users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      loadUsers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await adminAPI.deleteUser(userId);
        loadUsers(); // Recharger la liste
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'professional': return <UserCheck className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'professional': return 'bg-blue-100 text-blue-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'professional': return 'Professionnel';
      default: return 'Patient';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black px-6 pt-8 pb-6 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <Logo size="sm" variant="white" />
        </div>
        
        <div className="text-white">
          <h1 className="text-2xl mb-2">Gestion des Utilisateurs</h1>
          <p className="text-white/80">Administrez tous les utilisateurs</p>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous les rôles</option>
                <option value="patient">Patients</option>
                <option value="professional">Professionnels</option>
                <option value="admin">Admins</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                    </div>

                    {/* Infos utilisateur */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {user.prenom} {user.nom}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email || 'Non renseigné'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{user.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {user.lastLogin && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </div>

                      {/* Infos professionnel si applicable */}
                      {user.professionalProfile && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            {user.professionalProfile.specialty}
                          </p>
                          <p className="text-sm text-blue-600">
                            {user.professionalProfile.clinicName} • {user.professionalProfile.address}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-blue-600">
                              Note: {user.professionalProfile.rating}/5
                            </span>
                            {user.professionalProfile.verified && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                Vérifié
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isActive 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal détails utilisateur */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl">Détails de l'utilisateur</h3>
              <button 
                onClick={() => setShowUserModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${getRoleColor(selectedUser.role)}`}>
                {getRoleIcon(selectedUser.role)}
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-lg">{selectedUser.prenom} {selectedUser.nom}</h4>
                <p className="text-gray-600">{getRoleText(selectedUser.role)}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{selectedUser.email || 'Non renseigné'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone:</span>
                  <span>{selectedUser.telephone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className={selectedUser.isActive ? 'text-green-600' : 'text-red-600'}>
                    {selectedUser.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inscription:</span>
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {selectedUser.professionalProfile && (
                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium mb-2">Profil Professionnel</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spécialité:</span>
                      <span>{selectedUser.professionalProfile.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cabinet:</span>
                      <span>{selectedUser.professionalProfile.clinicName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Note:</span>
                      <span>{selectedUser.professionalProfile.rating}/5</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
