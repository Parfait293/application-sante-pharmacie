import { useState } from 'react';
import { ArrowLeft, User, Phone, Briefcase, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import type { User as UserType } from '../types';
import { USER_PROFESSIONS } from '../types';
import { Logo } from './Logo';
import { authAPI } from '../utils/api';

type SignupPageProps = {
  onSignup: (user: UserType, password: string) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
};

export function SignupPage({ onSignup, onNavigateToLogin, onBack }: SignupPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [profession, setProfession] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nom && prenom && telephone && profession) {
      setStep(2);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      try {
        const result = await authAPI.register({
          nom,
          prenom,
          telephone,
          profession,
          email: email || undefined,
          password
        });
        if (result.user) {
          onSignup(result.user, password);
        } else {
          alert(result.message || 'Erreur d\'inscription');
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('Erreur d\'inscription');
      }
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordLength = password.length >= 8;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-24 rounded-b-[3rem]">
        <button
          onClick={step === 2 ? () => setStep(1) : onBack}
          className="text-white flex items-center gap-2 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        <Logo size="md" variant="white" />
        <h1 className="text-white text-3xl mb-2 mt-6">Créer un compte</h1>
        <p className="text-white/80">
          {step === 1 ? 'Étape 1/2 : Informations personnelles' : 'Étape 2/2 : Sécurité'}
        </p>

        {/* Progress */}
        <div className="flex gap-2 mt-6">
          <div className="flex-1 h-1 bg-white rounded-full"></div>
          <div className={`flex-1 h-1 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/30'}`}></div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 -mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              {/* Nom */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Votre nom"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+228 90123456"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Profession <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors appearance-none bg-white"
                    required
                  >
                    <option value="">Sélectionnez votre profession</option>
                    {USER_PROFESSIONS.map((prof) => (
                      <option key={prof} value={prof}>
                        {prof}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email (optionnel) */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Email <span className="text-gray-400 text-sm">(optionnel)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow mt-6"
              >
                Continuer
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
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
                {/* Password requirements */}
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {passwordLength ? (
                    <Check className="w-4 h-4 text-cyan-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                  )}
                  <span className={passwordLength ? 'text-cyan-600' : 'text-gray-500'}>
                    Au moins 8 caractères
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {passwordsMatch ? (
                      <>
                        <Check className="w-4 h-4 text-cyan-500" />
                        <span className="text-cyan-600">Les mots de passe correspondent</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-red-300"></div>
                        <span className="text-red-500">Les mots de passe ne correspondent pas</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!passwordsMatch || !passwordLength}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer mon compte
              </button>
            </form>
          )}

          {/* Login Link */}
          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{' '}
                <button
                  onClick={onNavigateToLogin}
                  className="text-cyan-600 hover:underline"
                >
                  Se connecter
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}