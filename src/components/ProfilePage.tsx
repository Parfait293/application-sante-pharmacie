import { useState, useRef } from 'react';
import { ArrowLeft, User, Phone, Mail, Briefcase, Camera, Edit2, Save, X } from 'lucide-react';
import type { User as UserType } from '../types';
import { Logo } from './Logo';
import { userAPI } from '../utils/api';

type ProfilePageProps = {
  user: UserType;
  onBack: () => void;
  onUpdateUser: (user: UserType) => void;
  onLogout: () => void;
};

export function ProfilePage({ user, onBack, onUpdateUser, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    try {
      const result = await userAPI.updateProfile(editedUser);
      if (result.user) {
        onUpdateUser(result.user);
        setIsEditing(false);
      } else {
        alert(result.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Save profile error:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditedUser({ ...editedUser, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-24 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <Logo size="sm" variant="white" />
        </div>
        <h1 className="text-white text-2xl">Mon Profil</h1>
      </div>

      {/* Profile Content */}
      <div className="px-6 -mt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Photo de profil */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-cyan-100">
                {editedUser.photo ? (
                  <img src={editedUser.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                    <User className="w-14 h-14 text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <button onClick={() => photoInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            <h2 className="text-gray-800 mt-4">{user.prenom} {user.nom}</h2>
            <p className="text-gray-600">{user.profession}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                <Edit2 className="w-5 h-5" />
                <span>Modifier</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Enregistrer</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  <span>Annuler</span>
                </button>
              </>
            )}
          </div>

          {/* Informations */}
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Nom</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.nom}
                  onChange={(e) => setEditedUser({ ...editedUser, nom: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800">{user.nom}</span>
                </div>
              )}
            </div>

            {/* Prénom */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Prénom</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.prenom}
                  onChange={(e) => setEditedUser({ ...editedUser, prenom: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800">{user.prenom}</span>
                </div>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Téléphone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedUser.telephone}
                  onChange={(e) => setEditedUser({ ...editedUser, telephone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800">{user.telephone}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800">{user.email || 'Non renseigné'}</span>
                </div>
              )}
            </div>

            {/* Profession */}
            <div>
              <label className="block text-gray-600 text-sm mb-2">Profession</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.profession}
                  onChange={(e) => setEditedUser({ ...editedUser, profession: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-800">{user.profession}</span>
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-800 text-2xl mb-1">12</p>
              <p className="text-gray-600 text-sm">Consultations</p>
            </div>
            <div className="text-center">
              <p className="text-gray-800 text-2xl mb-1">8</p>
              <p className="text-gray-600 text-sm">Ordonnances</p>
            </div>
            <div className="text-center">
              <p className="text-gray-800 text-2xl mb-1">5</p>
              <p className="text-gray-600 text-sm">Pharmacies</p>
            </div>
          </div>

          {/* Déconnexion */}
          <button
            onClick={onLogout}
            className="w-full py-3 mt-8 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}