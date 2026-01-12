import React from 'react';

export type AppScreen = 'home' | 'pharmacy' | 'login' | 'registration';
export type ConsultationMode = 'enLigne' | 'domicile' | 'cabinet' | 'professionnelDuMetier';

export interface Professional {
  id: string;
  name: string;
  clinicName: string;
  specialty: string;
  rating: number;
  available: boolean;
  isPremium?: boolean;
  imageUrl?: string;
  consultationFee: number;
  clinics?: { id: string; name: string; address?: string; lat?: number; lng?: number }[];
  schedule?: string[]; // human readable schedule lines
}

export const HEALTH_SPECIALTIES = [
  'Généraliste',
  'Pédiatrie',
  'Gynécologie',
  'Dermatologie',
  'Infirmier',
  'Sage-femme',
  'Kinésithérapeute',
  'Psychologue',
];

export const DUMMY_PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Dr. A',
    clinicName: 'Clinique A',
    specialty: 'Généraliste',
    rating: 4.7,
    available: true,
    isPremium: true,
    imageUrl: '',
    consultationFee: 5000,
    clinics: [
      { id: 'c1', name: 'Clinique A', address: 'Boulevard 1, Ville', lat: 6.17, lng: 1.23 },
      { id: 'c2', name: 'Clinique Centrale', address: 'Avenue 2, Ville', lat: 6.18, lng: 1.22 },
    ],
    schedule: ['Lun 08:00-12:00', 'Mer 14:00-18:00', 'Ven 08:00-12:00'],
  },
  {
    id: 'p2',
    name: 'Dr. B',
    clinicName: 'Clinique B',
    specialty: 'Généraliste',
    rating: 4.3,
    available: false,
    isPremium: false,
    imageUrl: '',
    consultationFee: 4500,
    clinics: [
      { id: 'c2', name: 'Clinique Centrale', address: 'Avenue 2, Ville', lat: 6.18, lng: 1.22 },
      { id: 'c3', name: 'Clinique Sud', address: 'Rue 5, Ville', lat: 6.19, lng: 1.21 },
    ],
    schedule: ['Mar 09:00-12:00', 'Jeu 15:00-19:00'],
  },
];

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  isOnCall?: boolean;
  distance?: number; // in km
  lat?: number;
  lng?: number;
  availableMedicines: string[]; // list of medicine names available
}

export const DUMMY_PHARMACIES: Pharmacy[] = [
  { id: 'ph1', name: 'Pharmacie Centrale', address: 'Rue 1, Lomé', isOnCall: true, distance: 1.2, lat: 6.1725, lng: 1.2314, availableMedicines: ['Paracétamol', 'Ibuprofène', 'Aspirine'] },
  { id: 'ph2', name: 'Pharmacie Sud', address: 'Rue 2, Lomé', isOnCall: false, distance: 2.5, lat: 6.1625, lng: 1.2414, availableMedicines: ['Paracétamol', 'Amoxicilline'] },
  { id: 'ph3', name: 'Hôpital de Tokoin', address: 'Avenue 3, Lomé', distance: 3.1, lat: 6.1825, lng: 1.2214, availableMedicines: ['Ibuprofène', 'Amoxicilline', 'Insuline'] },
  { id: 'ph4', name: 'Clinique Sainte Marie', address: 'Boulevard 4, Lomé', distance: 4.0, lat: 6.1925, lng: 1.2114, availableMedicines: ['Paracétamol', 'Vitamine C'] },
];

export const DUMMY_MEDICINES = ['Paracétamol', 'Ibuprofène', 'Aspirine', 'Amoxicilline', 'Insuline', 'Vitamine C', 'Antibiotique X', 'Diclofénac', 'Oméprazole', 'Loratadine', 'Cétirizine', 'Furosémide', 'Metformine', 'Atorvastatine', 'Lisinopril', 'Warfarine', 'Digoxine', 'Prednisone', 'Hydrochlorothiazide', 'Simvastatine'];

// Minimal placeholder modals/components — remplacez par vos vraies implémentations
export function AuthPromptModal({ isOpen, onClose, onLogin, onRegister }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="font-bold mb-4">Connexion requise</h3>
        <div className="flex gap-2">
          <button onClick={onLogin} className="px-3 py-1 bg-teal-500 text-white rounded">Se connecter</button>
          <button onClick={onRegister} className="px-3 py-1 bg-gray-200 rounded">S'inscrire</button>
          <button onClick={onClose} className="px-3 py-1">Fermer</button>
        </div>
      </div>
    </div>
  );
}

export function WalletTransactionModal(_: any) { return null; }
export function AppointmentModal(_: any) { return null; }