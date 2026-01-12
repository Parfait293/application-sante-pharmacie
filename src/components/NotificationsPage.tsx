import { ArrowLeft, Bell, Calendar, Package, AlertCircle, Info, Check } from 'lucide-react';
import type { User } from '../App';
import { Logo } from './Logo';

type NotificationsPageProps = {
  user: User;
  onBack: () => void;
};

type Notification = {
  id: string;
  type: 'appointment' | 'order' | 'reminder' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

export function NotificationsPage({ user, onBack }: NotificationsPageProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'appointment',
      title: 'Rendez-vous confirmé',
      message: 'Votre consultation avec Dr. Marie Dubois est confirmée pour le 5 décembre à 14h30',
      time: 'Il y a 2 heures',
      read: false
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Rappel de consultation',
      message: 'Votre consultation est prévue demain à 14h30. N\'oubliez pas votre carte vitale.',
      time: 'Il y a 5 heures',
      read: false
    },
    {
      id: '3',
      type: 'order',
      title: 'Commande prête',
      message: 'Votre commande de Doliprane 1000mg est prête à être récupérée à la Pharmacie Centrale',
      time: 'Hier',
      read: true
    },
    {
      id: '4',
      type: 'info',
      title: 'Nouvelle pharmacie disponible',
      message: 'La Pharmacie du Parc a rejoint notre réseau et se trouve à 800m de chez vous',
      time: 'Il y a 2 jours',
      read: true
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Consultation terminée',
      message: 'Merci d\'avoir consulté Dr. Jean Martin. Vous pouvez télécharger votre ordonnance.',
      time: 'Il y a 3 jours',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    const icons = {
      appointment: { icon: <Calendar className="w-5 h-5" />, bg: 'bg-purple-500' },
      order: { icon: <Package className="w-5 h-5" />, bg: 'bg-cyan-500' },
      reminder: { icon: <AlertCircle className="w-5 h-5" />, bg: 'bg-orange-500' },
      info: { icon: <Info className="w-5 h-5" />, bg: 'bg-teal-500' }
    };
    return icons[type as keyof typeof icons] || icons.info;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl mb-2">Notifications</h1>
            <p className="text-white/80">
              {notifications.filter(n => !n.read).length} notifications non lues
            </p>
          </div>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-sm text-sm">
            Tout marquer lu
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 mt-6">
        <div className="space-y-3">
          {notifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-md p-5 transition-all hover:shadow-lg ${
                  !notification.read ? 'ring-2 ring-cyan-200' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 ${iconConfig.bg} rounded-xl flex items-center justify-center flex-shrink-0 text-white`}>
                    {iconConfig.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`text-gray-800 ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 ml-2 mt-2"></div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs">{notification.time}</p>
                  </div>
                </div>
                {!notification.read && (
                  <button className="mt-4 w-full py-2 border-2 border-cyan-200 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors text-sm flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    Marquer comme lu
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state si pas de notifications */}
        {notifications.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-800 mb-2">Aucune notification</h3>
            <p className="text-gray-600">
              Vous êtes à jour !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}