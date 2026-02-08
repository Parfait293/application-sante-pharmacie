import { useState } from 'react';
import { ArrowLeft, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { authAPI } from '../utils/api';
import { WEST_AFRICA_COUNTRIES } from '../types';

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
  const [selectedCountry, setSelectedCountry] = useState(WEST_AFRICA_COUNTRIES[0]); // Togo par défaut

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier && password) {
      // Validation du mot de passe : minimum 8 caractères sans contrainte spécifique
      if (password.length < 8) {
        alert('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
      
      // Construire l'identifiant complet avec le préfixe pays si téléphone
      const fullIdentifier = usePhone ? `${selectedCountry.code}${identifier.replace(/\s/g, '')}` : identifier;
      
      // Appeler la fonction onLogin avec l'identifiant et le mot de passe
      onLogin(fullIdentifier, password);
    }
  };

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-24 rounded-b-[3rem]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        <Logo size="md" variant="white" />
        <h1 className="mt-6 mb-2 text-white text-3xl">Bon retour !</h1>
        <p className="text-white/80">Connectez-vous pour continuer</p>
      </div>

      {/* Form */}
      <div className="-mt-16 px-6">
        <div className="bg-white shadow-xl p-8 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Toggle Phone/Email */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUsePhone(true)}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  usePhone
                    ? 'bg-white text-cyan-600 shadow-md'
                    : 'text-gray-600'
                }`}
              >
                <Phone className="mx-auto mb-1 w-5 h-5" />
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
                <Mail className="mx-auto mb-1 w-5 h-5" />
                <span className="text-sm">Email</span>
              </button>
            </div>

            {/* Identifier Input */}
            <div>
              <label className="block mb-2 text-gray-700">
                {usePhone ? 'Numéro de téléphone' : 'Adresse email'}
              </label>
              {usePhone ? (
                <div className="flex gap-2">
                  {/* Sélecteur de pays */}
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const country = WEST_AFRICA_COUNTRIES.find(c => c.code === e.target.value);
                      if (country) setSelectedCountry(country);
                    }}
                    className="bg-white px-3 py-4 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none transition-colors appearance-none"
                  >
                    {WEST_AFRICA_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  
                  {/* Input du numéro de téléphone */}
                  <div className="relative flex-1">
                    <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="90 06 00 15"
                      className="py-4 pr-4 pl-12 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full transition-colors"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="exemple@email.com"
                    className="py-4 pr-4 pl-12 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full transition-colors"
                    required
                  />
                </div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-2 text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="py-4 pr-12 pl-12 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="top-1/2 right-4 absolute text-gray-400 hover:text-gray-600 -translate-y-1/2"
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
              className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 hover:shadow-lg py-4 rounded-xl w-full text-white transition-shadow"
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