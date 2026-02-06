import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, CheckCircle, XCircle, Video, Phone, Users, MessageSquare, FileText, Search, Filter } from 'lucide-react';
import type { User, Professional, ProfessionalAppointment } from '../types';
import { Logo } from './Logo';
import { professionalAPI } from '../utils/api';

type ProfessionalAppointmentsPageProps = {
  user: User;
  professional: Professional;
  onBack: () => void;
};

type AppointmentStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';

export function ProfessionalAppointmentsPage({ user, professional, onBack }: ProfessionalAppointmentsPageProps) {
  const [appointments, setAppointments] = useState<ProfessionalAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<ProfessionalAppointment | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await professionalAPI.getAppointments();
      if (response.appointments) {
        setAppointments(response.appointments);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patient.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateAppointment = async (appointmentId: string, updates: any) => {
    try {
      await professionalAPI.updateAppointment(appointmentId, updates);
      loadAppointments(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    }
  };

  const handleConfirmAppointment = (appointment: ProfessionalAppointment) => {
    handleUpdateAppointment(appointment.id, { status: 'confirmed' });
  };

  const handleCompleteAppointment = (appointment: ProfessionalAppointment) => {
    setSelectedAppointment(appointment);
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    if (selectedAppointment) {
      handleUpdateAppointment(selectedAppointment.id, {
        status: 'completed',
        notes,
        prescription,
        followUpRequired: true
      });
      setShowNotesModal(false);
      setNotes('');
      setPrescription('');
      setSelectedAppointment(null);
    }
  };

  const handleCancelAppointment = (appointment: ProfessionalAppointment) => {
    handleUpdateAppointment(appointment.id, { status: 'cancelled' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-blue-500" />;
      case 'domicile': return <Phone className="w-4 h-4 text-green-500" />;
      case 'cabinet': return <Users className="w-4 h-4 text-purple-500" />;
      default: return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-6 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <Logo size="sm" variant="white" />
        </div>
        
        <div className="text-white">
          <h1 className="text-2xl mb-2">Mes Rendez-vous</h1>
          <p className="text-white/80">Gérez vos consultations</p>
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {(['all', 'upcoming', 'completed', 'cancelled'] as AppointmentStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    statusFilter === status
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des rendez-vous */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-cyan-600 font-semibold">
                          {appointment.patient.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{appointment.patient.name}</h3>
                        <p className="text-sm text-gray-600">{appointment.patient.phone}</p>
                        {appointment.patient.email && (
                          <p className="text-sm text-gray-500">{appointment.patient.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(appointment.type)}
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}

                    {appointment.prescription && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">
                          <strong>Ordonnance:</strong> {appointment.prescription}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      {appointment.isPaid ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm text-gray-600">
                        {appointment.consultationFee?.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {appointment.status === 'upcoming' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleConfirmAppointment(appointment)}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleCompleteAppointment(appointment)}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Terminer
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                )}

                {appointment.status === 'completed' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      Voir l'ordonnance
                    </button>
                    <button className="flex-1 py-2 bg-cyan-100 text-cyan-600 rounded-lg hover:bg-cyan-200 transition-colors flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Contacter
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Aucun rendez-vous trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour ajouter des notes */}
      {showNotesModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl">Terminer la consultation</h3>
              <button 
                onClick={() => setShowNotesModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Patient: <strong>{selectedAppointment.patient.name}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Notes de consultation</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Décrivez la consultation..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Ordonnance</label>
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Prescription médicale..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <button
              onClick={handleSaveNotes}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-shadow"
            >
              Enregistrer et terminer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
