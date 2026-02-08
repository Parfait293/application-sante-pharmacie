import { useState } from 'react';
import { ArrowLeft, User, Phone, Briefcase, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import type { User as UserType } from '../types';
import { USER_PROFESSIONS, HEALTH_PROFESSIONS, WEST_AFRICA_COUNTRIES } from '../types';
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
  const [selectedCountry, setSelectedCountry] = useState(WEST_AFRICA_COUNTRIES[0]); // Togo par défaut

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nom && prenom && telephone && profession) {
      setStep(2);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      // Validation du mot de passe : minimum 8 caractères sans contrainte spécifique
      if (password.length < 8) {
        alert('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
      
      // Construire le numéro de téléphone complet avec le préfixe pays
      const fullTelephone = `${selectedCountry.code}${telephone.replace(/\s/g, '')}`;
      
      try {
        const result = await authAPI.register({
          nom,
          prenom,
          telephone: fullTelephone,
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
    <div className="bg-gradient-to-b from-cyan-50 to-white pb-10 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-24 rounded-b-[3rem]">
        <button
          onClick={step === 2 ? () => setStep(1) : onBack}
          className="flex items-center gap-2 mb-8 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>
        <Logo size="md" variant="white" />
        <h1 className="mt-6 mb-2 text-white text-3xl">Créer un compte</h1>
        <p className="text-white/80">
          {step === 1 ? 'Étape 1/2 : Informations personnelles' : 'Étape 2/2 : Sécurité'}
        </p>

        {/* Progress */}
        <div className="flex gap-2 mt-6">
          <div className="flex-1 bg-white rounded-full h-1"></div>
          <div className={`flex-1 h-1 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/30'}`}></div>
        </div>
      </div>

      {/* Form */}
      <div className="-mt-16 px-6">
        <div className="bg-white shadow-xl p-8 rounded-3xl">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              {/* Nom */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Votre nom"
                    className="py-4 pr-4 pl-12 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Prénom */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Votre prénom"
                    className="py-4 pr-4 pl-12 border-2 border-gray-200 focus:border-green-500 rounded-xl focus:outline-none w-full transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </label>
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
                    <div className="top-1/2 left-4 z-10 absolute text-gray-400 -translate-y-1/2 pointer-events-none">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="90 06 00 15"
                      className="py-4 pr-4 pl-12 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Profession */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Profession <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="top-1/2 left-4 z-10 absolute text-gray-400 -translate-y-1/2 pointer-events-none">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="bg-white py-4 pr-4 pl-12 border-2 border-gray-200 focus:border-green-500 rounded-xl focus:outline-none w-full transition-colors appearance-none"
                    required
                  >
                    <option value="">Sélectionnez votre profession</option>
                    <optgroup label="Professions de santé">
                      {HEALTH_PROFESSIONS.map((prof) => (
                        <option key={prof} value={prof}>
                          {prof}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Autres professions">
                      {USER_PROFESSIONS.map((prof) => (
                        <option key={prof} value={prof}>
                          {prof}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Email (optionnel) */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Email <span className="text-gray-400 text-sm">(optionnel)</span>
                </label>
                <div className="relative">
                  <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="py-4 pr-4 pl-12 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:shadow-lg mt-6 py-4 rounded-xl w-full text-white transition-shadow"
              >
                Continuer
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-5">
              {/* Password */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
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
                {/* Password requirements */}
                <div className="flex items-center gap-2 mt-2 text-sm">
                  {passwordLength ? (
                    <Check className="w-4 h-4 text-cyan-500" />
                  ) : (
                    <div className="border-2 border-gray-300 rounded-full w-4 h-4"></div>
                  )}
                  <span className={passwordLength ? 'text-cyan-600' : 'text-gray-500'}>
                    Au moins 8 caractères
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-gray-700">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className="py-4 pr-12 pl-12 border-2 border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="top-1/2 right-4 absolute text-gray-400 hover:text-gray-600 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    {passwordsMatch ? (
                      <>
                        <Check className="w-4 h-4 text-cyan-500" />
                        <span className="text-cyan-600">Les mots de passe correspondent</span>
                      </>
                    ) : (
                      <>
                        <div className="border-2 border-red-300 rounded-full w-4 h-4"></div>
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
                className="bg-gradient-to-r from-green-500 to-blue-600 disabled:opacity-50 hover:shadow-lg mt-6 py-4 rounded-xl w-full text-white transition-shadow disabled:cursor-not-allowed"
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