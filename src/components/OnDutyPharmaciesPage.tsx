import { ArrowLeft, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Logo } from './Logo';

type OnDutyPharmaciesPageProps = {
  onBack: () => void;
};

export function OnDutyPharmaciesPage({ onBack }: OnDutyPharmaciesPageProps) {
  // Pharmacies de garde (accessible sans connexion)
  const onDutyPharmacies = [
    {
      name: 'Pharmacie de Garde Centrale',
      address: '12 Avenue de la République, Lomé',
      phone: '+228 22 21 45 67',
      image: 'https://images.unsplash.com/photo-1760307837671-63ee641f9f1c?w=800&h=600&fit=crop',
      hours: '24h/24',
      distance: '0.8 km'
    },
    {
      name: 'Pharmacie Saint-Joseph',
      address: '45 Rue du Commerce, Lomé',
      phone: '+228 22 22 33 44',
      image: 'https://images.unsplash.com/photo-1760307837671-63ee641f9f1c?w=800&h=600&fit=crop',
      hours: '20h - 8h',
      distance: '1.5 km'
    },
    {
      name: 'Pharmacie de Garde du Port',
      address: 'Boulevard du 13 Janvier, Lomé',
      phone: '+228 22 23 45 67',
      image: 'https://images.unsplash.com/photo-1760307837671-63ee641f9f1c?w=800&h=600&fit=crop',
      hours: '24h/24',
      distance: '2.3 km'
    },
    {
      name: 'Pharmacie Espoir',
      address: '8 Boulevard Victor Hugo, Lomé',
      phone: '+228 22 24 56 78',
      image: 'https://images.unsplash.com/photo-1760307837671-63ee641f9f1c?w=800&h=600&fit=crop',
      hours: '18h - 8h',
      distance: '3.1 km'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-10">
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <Logo size="sm" variant="white" />
        </div>
        <h1 className="text-white text-2xl mb-2">Pharmacies de Garde</h1>
        <p className="text-white/80">Ouvertes en dehors des horaires normaux</p>
      </div>

      <div className="px-6 mt-6">
        <div className="bg-cyan-50 rounded-2xl p-4 mb-6 border-2 border-cyan-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-800 mb-1">Service 24h/24</h3>
              <p className="text-gray-600 text-sm">
                Ces pharmacies sont disponibles en cas d'urgence, même la nuit et les jours fériés.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {onDutyPharmacies.map((pharmacy, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex">
                <img
                  src={pharmacy.image}
                  alt={pharmacy.name}
                  className="w-32 h-32 object-cover"
                />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-800 flex-1">{pharmacy.name}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full whitespace-nowrap ml-2">
                      De garde
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{pharmacy.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{pharmacy.hours}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Navigation className="w-4 h-4 flex-shrink-0" />
                      <span>{pharmacy.distance}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <a
                      href={`tel:${pharmacy.phone}`}
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Appeler
                    </a>
                    <button className="px-4 py-2 border-2 border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors">
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-gray-800 mb-3">Informations importantes</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 mt-1">•</span>
              <span>Les pharmacies de garde sont ouvertes en dehors des horaires normaux</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 mt-1">•</span>
              <span>Un supplément peut être appliqué pour les services de nuit</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-600 mt-1">•</span>
              <span>Appelez avant de vous déplacer pour vérifier la disponibilité</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
