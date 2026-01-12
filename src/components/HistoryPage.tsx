import { useState } from 'react';
import { ArrowLeft, Calendar, Package, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
};
import { Logo } from './Logo';

type Appointment = {
  id: string;
  status: string;
  date: string;
  time: string;
  type: 'video' | 'cabinet' | 'domicile' | string;
  professional: {
    image: string;
    name: string;
    specialty: string;
  };
};

type Order = {
  id: string;
  medication: string;
  pharmacy: string;
  date: string;
  price: string;
  status: string;
};

type HistoryPageProps = {
  user: User;
  onBack: () => void;
  appointments: Appointment[];
  orders: Order[];
};

export function HistoryPage({ user, onBack, appointments, orders }: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'orders'>('appointments');

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <AlertCircle className="w-4 h-4" />, label: 'À venir' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-4 h-4" />, label: 'Terminé' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: <XCircle className="w-4 h-4" />, label: 'Annulé' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="w-4 h-4" />, label: 'En attente' },
      ready: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CheckCircle className="w-4 h-4" />, label: 'Prêt' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-4 h-4" />, label: 'Livré' },
      online: { bg: 'bg-purple-100', text: 'text-purple-700', icon: <CheckCircle className="w-4 h-4" />, label: 'En ligne' },
      domicile: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <CheckCircle className="w-4 h-4" />, label: 'À domicile' },
      cabinet: { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: <CheckCircle className="w-4 h-4" />, label: 'Cabinet' },
      video: { bg: 'bg-teal-100', text: 'text-teal-700', icon: <CheckCircle className="w-4 h-4" />, label: 'Vidéo' }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-3xl">
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
        <h1 className="text-white text-2xl mb-2">Historique</h1>
        <p className="text-white/80">Vos consultations et commandes</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-md">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'appointments'
                ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600'
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Consultations</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white shadow-lg'
                : 'text-gray-600'
            }`}
          >
            <Package className="w-5 h-5 mx-auto mb-1" />
            <span className="text-sm">Commandes</span>
          </button>
        </div>
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="px-6 mt-6">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const badge = getStatusBadge(appointment.status);
                return (
                  <div key={appointment.id} className="bg-white rounded-2xl shadow-md p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={appointment.professional.image}
                          alt={appointment.professional.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="text-gray-800 mb-1">{appointment.professional.name}</h3>
                          <p className="text-gray-600 text-sm">{appointment.professional.specialty}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs rounded-full flex items-center gap-1`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.type === 'video' ? 'Consultation en ligne' : 'Consultation au cabinet'}</span>
                      </div>
                    </div>
                    {appointment.status === 'upcoming' && (
                      <div className="flex gap-3 mt-4">
                        <button className="flex-1 py-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-shadow text-sm">
                          Voir les détails
                        </button>
                        <button className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-800 mb-2">Aucune consultation</h3>
              <p className="text-gray-600">
                Vous n'avez pas encore de consultations
              </p>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="px-6 mt-6">
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <div key={order.id} className="bg-white rounded-2xl shadow-md p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-gray-800 mb-1">{order.medication}</h3>
                        <p className="text-gray-600 text-sm">{order.pharmacy}</p>
                      </div>
                      <span className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs rounded-full flex items-center gap-1`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(order.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-cyan-600">{order.price}</p>
                    </div>
                    {order.status !== 'delivered' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button className="w-full py-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-lg hover:shadow-md transition-shadow text-sm">
                          Suivre ma commande
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-gray-800 mb-2">Aucune commande</h3>
              <p className="text-gray-600">
                Vous n'avez pas encore de commandes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}