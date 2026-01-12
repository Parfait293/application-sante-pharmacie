// Types centralisés pour l'application

export type User = {
  nom: string;
  prenom: string;
  telephone: string;
  profession: string;
  email?: string;
  photo?: string;
  countryCode?: string;
  walletBalance?: number; // Portefeuille électronique
};

export type Appointment = {
  id: string;
  professional: {
    name: string;
    specialty: string;
    image: string;
    phone: string;
    workSchedule?: WorkSchedule[];
  };
  date: string;
  time: string;
  type: 'online' | 'domicile' | 'cabinet' | 'video';
  status: 'upcoming' | 'completed' | 'cancelled';
  consultationFee?: number;
  isPaid?: boolean;
};

export type WorkSchedule = {
  day: string; // lundi, mardi, etc.
  location: string; // nom de la clinique/cabinet
  address: string;
  hours: string; // ex: "09:00 - 17:00"
  availableSlots?: string[];
};

export type Order = {
  id: string;
  medication: string;
  pharmacy: string;
  date: string;
  status: 'pending' | 'ready' | 'delivered';
  price: string;
};

export type Professional = {
  id: number;
  name: string;
  clinicName: string;
  specialty: string;
  image: string;
  available: boolean;
  rating: number;
  isPremium: boolean;
  address: string;
  phone: string;
  consultationFee: number;
  walletBalance?: number; // Nouveau champ pour le portefeuille
  workSchedule: WorkSchedule[];
  autoMessage?: string; // Message automatique si non disponible
};

export type Pharmacy = {
  name: string;
  address: string;
  phone: string;
  image: string;
  isOpen: boolean;
  isOnDuty: boolean; // Pharmacie de garde
  distance?: string;
};

export type PaymentMethod = 'moov' | 'yas-togo' | 'carte-bancaire';

export type Transaction = {
  id: string;
  type: 'deposit' | 'consultation' | 'refund';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  description: string;
  paymentMethod?: PaymentMethod;
};

// Liste complète des 48 professions de santé
export const HEALTH_PROFESSIONS = [
  'Médecin généraliste',
  'Médecin urgentiste',
  'Cardiologue',
  'Pédiatre',
  'Gynécologue',
  'Dermatologue',
  'Ophtalmologue',
  'ORL (Oto-rhino-laryngologiste)',
  'Psychiatre',
  'Neurologue',
  'Radiologue',
  'Anesthésiste',
  'Chirurgien général',
  'Chirurgien orthopédiste',
  'Urologue',
  'Gastro-entérologue',
  'Endocrinologue',
  'Rhumatologue',
  'Pneumologue',
  'Néphrologue',
  'Hématologue',
  'Oncologue',
  'Gériatre',
  'Pharmacien',
  'Infirmier',
  'Sage-femme',
  'Kinésithérapeute',
  'Ostéopathe',
  'Chiropracteur',
  'Ergothérapeute',
  'Psychomotricien',
  'Orthophoniste',
  'Diététicien',
  'Nutritionniste',
  'Podologue',
  'Dentiste',
  'Orthodontiste',
  'Psychologue',
  'Psychothérapeute',
  'Opticien',
  'Audioprothésiste',
  'Manipulateur radio',
  'Biologiste médical',
  'Aide-soignant',
  'Ambulancier',
  'Prothésiste dentaire',
  'Orthoprothésiste',
  'Technicien de laboratoire'
];

// Pays d'Afrique de l'Ouest avec codes téléphoniques
export const WEST_AFRICA_COUNTRIES = [
  { name: 'Togo', code: '+228' },
  { name: 'Bénin', code: '+229' },
  { name: 'Niger', code: '+227' },
  { name: 'Burkina Faso', code: '+226' },
  { name: 'Mali', code: '+223' },
  { name: 'Côte d\'Ivoire', code: '+225' },
  { name: 'Ghana', code: '+233' },
  { name: 'Sénégal', code: '+221' },
  { name: 'Guinée', code: '+224' },
  { name: 'Gambie', code: '+220' },
  { name: 'Mauritanie', code: '+222' },
  { name: 'Liberia', code: '+231' },
  { name: 'Sierra Leone', code: '+232' },
  { name: 'Nigeria', code: '+234' }
];

// Professions générales (pour les utilisateurs)
export const USER_PROFESSIONS = [
  'Étudiant',
  'Enseignant',
  'Ingénieur',
  'Commerçant',
  'Artisan',
  'Fonctionnaire',
  'Agriculteur',
  'Entrepreneur',
  'Retraité',
  'Sans emploi',
  'Autre'
];
