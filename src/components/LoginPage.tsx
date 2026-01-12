import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { authAPI } from '../utils/api';

type LoginPageProps = {
  onLogin: (identifier: string, password: string) => void;
  onNavigateToSignup: () => void;
  onBack: () => void;
};

export function LoginPage({ onLogin, onNavigateToSignup, onBack }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usePhone, setUsePhone] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier && password) {
      try {
        const result = await authAPI.login({ identifier, password });
        if (result.user) {
          onLogin(result.user, result.token);
        } else {
          alert(result.message || 'Erreur de connexion');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Erreur de connexion');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-24 rounded-b-[3rem]">
        <button
          onClick={onBack}
          className="text-white flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        <Logo size="md" variant="white" />
        <h1 className="text-white text-3xl mb-2 mt-6">Bon retour !</h1>
        <p className="text-white/80">Connectez-vous pour continuer</p>
      </div>

      {/* Form */}
      <div className="px-6 -mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle Phone/Email */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setUsePhone(true)}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  usePhone
                    ? 'bg-white text-cyan-600 shadow-md'
                    : 'text-gray-600'
                }`}
              >
                <Phone className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Téléphone</span>
              </button>
              <button
                type="button"
                onClick={() => setUsePhone(false)}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  !usePhone
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-gray-600'
                }`}
              >
                <Mail className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Email</span>
              </button>
            </div>

            {/* Identifier Input */}
            <div>
              <label className="block text-gray-700 mb-2">
                {usePhone ? 'Numéro de téléphone' : 'Adresse email'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {usePhone ? (
                    <Phone className="w-5 h-5" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </div>
                <input
                  type={usePhone ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={usePhone ? '+228 90 06 00 15' : 'exemple@email.com'}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-purple-600 text-sm hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              Se connecter
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <button
                onClick={onNavigateToSignup}
                className="text-cyan-600 hover:underline"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}