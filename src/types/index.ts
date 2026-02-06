// Types centralisés pour l'application

export type User = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  profession: string;
  email?: string;
  photo?: string;
  countryCode?: string;
  walletBalance?: number; // Portefeuille électronique
  role: 'patient' | 'professional' | 'admin';
  professionalProfile?: Professional; // Si c'est un professionnel
  createdAt?: string;
  isActive?: boolean;
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
  id: string;
  userId: string; // Référence à l'utilisateur
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
  walletBalance?: number; // Portefeuille professionnel
  workSchedule: WorkSchedule[];
  autoMessage?: string; // Message automatique si non disponible
  verified?: boolean; // Vérifié par l'admin
  licenseNumber?: string; // Numéro de licence
  experience?: number; // Années d'expérience
  certifications?: string[]; // Certifications
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

// Types pour l'administration
export type AdminStats = {
  totalUsers: number;
  totalProfessionals: number;
  totalAppointments: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
};

export type AdminUser = {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  role: 'patient' | 'professional' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  professionalProfile?: Professional;
};

export type AdminAppointment = {
  id: string;
  patient: string;
  professional: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  consultationFee: number;
  isPaid: boolean;
};

export type ProfessionalAppointment = Appointment & {
  patient: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
  notes?: string; // Notes du professionnel
  prescription?: string; // Ordonnance
  followUpRequired?: boolean;
};

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
