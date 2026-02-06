import { useState } from 'react';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, Check } from 'lucide-react';
import type { User } from '../types';
import { Logo } from './Logo';

type AdminAccessPageProps = {
  onAdminLogin: (user: User) => void;
  onBack: () => void;
};

export function AdminAccessPage({ onAdminLogin, onBack }: AdminAccessPageProps) {
  const [adminCode, setAdminCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Code admin par défaut pour la démo
  const ADMIN_ACCESS_CODE = 'ADMIN2024';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminCode !== ADMIN_ACCESS_CODE) {
      alert('Code d\'accès administrateur incorrect');
      return;
    }

    setLoading(true);
    
    try {
      // Simuler la connexion admin
      const adminUser: User = {
        id: 'admin-1',
        nom: 'Admin',
        prenom: 'Système',
        telephone: '+22800000000',
        email: 'admin@sante-pharmacie.tg',
        profession: 'Administrateur système',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        walletBalance: 0
      };

      // Simuler un token
      localStorage.setItem('token', 'admin-token-' + Date.now());
      
      setTimeout(() => {
        onAdminLogin(adminUser);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la connexion admin:', error);
      alert('Erreur lors de la connexion admin');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="lg" variant="white" className="mx-auto mb-6" />
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Accès Administrateur</h1>
          <p className="text-gray-400">Entrez votre code d'accès admin</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Code d'accès admin
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type={showCode ? 'text' : 'password'}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Entrez le code admin"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
                >
                  {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !adminCode}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Accéder à l'admin
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-200 text-sm text-center">
              <strong>Code démo :</strong> ADMIN2024
            </p>
          </div>
        </div>

        {/* Retour */}
        <button
          onClick={onBack}
          className="mt-6 text-gray-400 hover:text-white flex items-center gap-2 mx-auto transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
