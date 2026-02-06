import { useState } from 'react';
import { ArrowLeft, User as UserIcon, Phone, Mail, Lock, Briefcase, MapPin, Star, FileText, Eye, EyeOff, Check } from 'lucide-react';
import type { User, Professional } from '../types';
import { HEALTH_PROFESSIONS } from '../types';
import { Logo } from './Logo';

type ProfessionalSignupPageProps = {
  onProfessionalSignup: (user: User, password: string) => void;
  onNavigateToLogin: () => void;
  onBack: () => void;
};

export function ProfessionalSignupPage({ onProfessionalSignup, onNavigateToLogin, onBack }: ProfessionalSignupPageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Infos professionnelles
  const [specialty, setSpecialty] = useState('');
  const [clinicName, setCliclinicName] = useState('');
  const [address, setAddress] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nom && prenom && telephone && email) {
      setStep(2);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (specialty && clinicName && address && consultationFee) {
      setStep(3);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password === confirmPassword) {
      setLoading(true);
      
      try {
        // Créer le profil professionnel
        const professionalProfile: Professional = {
          id: 'prof-' + Date.now(),
          userId: 'user-' + Date.now(),
          name: `Dr. ${prenom} ${nom}`,
          clinicName,
          specialty,
          image: '',
          available: true,
          rating: 0,
          isPremium: false,
          address,
          phone: telephone,
          consultationFee: parseInt(consultationFee),
          workSchedule: [],
          verified: false,
          licenseNumber,
          experience: parseInt(experience) || 0,
          certifications: []
        };

        // Créer l'utilisateur avec rôle professionnel
        const user: User = {
          id: professionalProfile.userId,
          nom,
          prenom,
          telephone,
          profession: specialty,
          email,
          role: 'professional',
          professionalProfile,
          createdAt: new Date().toISOString(),
          isActive: true,
          walletBalance: 0
        };

        // Simuler l'inscription
        setTimeout(() => {
          onProfessionalSignup(user, password);
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Erreur lors de l\'inscription professionnelle:', error);
        alert('Erreur lors de l\'inscription');
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-cyan-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-white">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <Logo size="sm" variant="white" />
        </div>
        
        <div className="text-white">
          <h1 className="mb-2 text-2xl">Inscription Professionnel</h1>
          <p className="text-white/80">Rejoignez notre réseau de santé</p>
        </div>

        {/* Progression */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-white text-cyan-600' : 'bg-white/20 text-white'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-8 h-1 ${
                  step > s ? 'bg-white' : 'bg-white/20'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Étape 1: Informations personnelles */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
            <div className="bg-white shadow-lg p-6 rounded-2xl">
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <UserIcon className="w-5 h-5 text-cyan-600" />
                Informations personnelles
              </h3>
              
              <div className="space-y-4">
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <label className="block mb-2 text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      placeholder="Votre nom"
                      className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Prénom</label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Votre prénom"
                      className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+228XXXXXXXXX"
                    className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-lg py-4 rounded-xl w-full font-medium text-white transition-shadow"
            >
              Continuer
            </button>
          </form>
        )}

        {/* Étape 2: Informations professionnelles */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-6">
            <div className="bg-white shadow-lg p-6 rounded-2xl">
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <Briefcase className="w-5 h-5 text-cyan-600" />
                Informations professionnelles
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700">Spécialité</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                    required
                  >
                    <option value="">Sélectionnez une spécialité</option>
                    {HEALTH_PROFESSIONS.map((prof) => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Nom du cabinet</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setCliclinicName(e.target.value)}
                    placeholder="Cabinet Médical..."
                    className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Adresse</label>
                  <div className="relative">
                    <MapPin className="top-3 left-3 absolute w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Adresse complète du cabinet"
                      className="py-3 pr-4 pl-10 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                      required
                    />
                  </div>
                </div>

                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <label className="block mb-2 text-gray-700">Honoraires (FCFA)</label>
                    <input
                      type="number"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(e.target.value)}
                      placeholder="5000"
                      className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-gray-700">Expérience (années)</label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="5"
                      className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Numéro de licence</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="N° licence professionnelle"
                    className="px-4 py-3 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 hover:bg-gray-50 py-4 border border-gray-300 rounded-xl font-medium text-gray-700 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-lg py-4 rounded-xl font-medium text-white transition-shadow"
              >
                Continuer
              </button>
            </div>
          </form>
        )}

        {/* Étape 3: Mot de passe */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-6">
            <div className="bg-white shadow-lg p-6 rounded-2xl">
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <Lock className="w-5 h-5 text-cyan-600" />
                Sécurité du compte
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-700">Mot de passe</label>
                  <div className="relative">
                    <Lock className="top-3 left-3 absolute w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mot de passe sécurisé"
                      className="py-3 pr-12 pl-10 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="top-3 right-3 absolute text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="top-3 left-3 absolute w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmez le mot de passe"
                      className="py-3 pr-12 pl-10 border border-gray-200 focus:border-cyan-500 rounded-xl focus:outline-none w-full"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="top-3 right-3 absolute text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 hover:bg-gray-50 py-4 border border-gray-300 rounded-xl font-medium text-gray-700 transition-colors"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 disabled:opacity-50 hover:shadow-lg py-4 rounded-xl font-medium text-white transition-shadow"
              >
                {loading ? (
                  <>
                    <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></div>
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Créer mon compte
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
