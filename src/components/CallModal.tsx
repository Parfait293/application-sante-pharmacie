import React from 'react';
import { Phone, Video } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  professional: any;
  onClose: () => void;
  onStartCall?: (type: 'vocal' | 'video') => void;
  walletBalance?: number;
  onHoldPayment?: (profId: number, amount: number) => { ok: boolean; reason?: string };
  lockedAmount?: number;
  onConfirmComplete?: (profId: number) => void;
}

export const CallModal: React.FC<CallModalProps> = ({ isOpen, professional, onClose, onStartCall, walletBalance = 0, onHoldPayment, lockedAmount = 0, onConfirmComplete }) => {
  if (!isOpen) return null;

  const vocalFee = 5000;
  const videoFee = 7000;
  const [isHeld, setIsHeld] = React.useState<boolean>(false);
  const [heldType, setHeldType] = React.useState<'vocal' | 'video' | null>(null);

  const start = (type: 'vocal' | 'video') => {
    const fee = type === 'vocal' ? vocalFee : videoFee;
    if (!isHeld || heldType !== type) {
      if (!onHoldPayment) return alert('Fonction paiement non disponible.');
      const res = onHoldPayment(professional?.id, fee);
      if (!res.ok) return alert(`Paiement échoué: ${res.reason ?? 'solde insuffisant'}`);
      setIsHeld(true);
      setHeldType(type);
      alert(`Montant de ${fee.toFixed(2)} FCFA réservé dans votre portefeuille.`);
      return;
    }
    if (onStartCall) onStartCall(type);
    // simulate connecting
    setTimeout(() => {
      alert(`${type === 'video' ? 'Visio' : 'Appel vocal'} en cours avec ${professional?.name || professional?.clinicName || 'le professionnel'}`);
      // after simulated call, ask for confirmation to release funds
      const confirmed = window.confirm('Confirmez-vous que l\'appel a bien eu lieu ? (Si oui, les fonds seront transférés au professionnel)');
      if (confirmed && onConfirmComplete) {
        onConfirmComplete(professional?.id);
        alert('Merci, le paiement a été libéré.');
      } else {
        alert('Le paiement reste bloqué jusqu\'a confirmation. Contactez le support pour assistance.');
      }
    }, 800);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Contact rapide</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="prof-line">
            <img src={professional?.imageUrl || '/placeholder.png'} alt={professional?.name} className="card-avatar" />
            <div>
              <div className="font-semibold">{professional?.name || professional?.clinicName}</div>
              <div className="text-sm text-gray-500">{professional?.specialty}</div>
            </div>
          </div>

          <p className="text-sm mt-3">Choisissez le type de contact :</p>

          <div className="mt-3 text-sm">
            <div>Frais vocal: <strong>{vocalFee.toFixed(2)} FCFA</strong></div>
            <div>Frais visio: <strong>{videoFee.toFixed(2)} FCFA</strong></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="modal-action" onClick={() => start('vocal')}>
              <Phone className="w-5 h-5" /> Lancer appel vocal
            </button>
            <button className="modal-action" onClick={() => start('video')}>
              <Video className="w-5 h-5" /> Lancer visio
            </button>
          </div>

          <div className="text-xs mt-3 text-gray-500">
            Solde: <span className={walletBalance < vocalFee ? 'text-red-600 font-bold' : ''}>{walletBalance.toFixed(2)} FCFA</span> — 
            Bloqué: <span className="text-red-600 font-bold">{(lockedAmount ?? 0).toFixed(2)} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
