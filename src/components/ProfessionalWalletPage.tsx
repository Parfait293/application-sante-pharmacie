import { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, TrendingUp, Users, Calendar, Banknote, Loader2, Check } from 'lucide-react';
import type { Professional } from '../types';
import { Logo } from './Logo';
import { professionalAPI } from '../utils/api';

type ProfessionalWalletPageProps = {
  professional: Professional;
  onBack: () => void;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  description: string;
};

export function ProfessionalWalletPage({ professional, onBack }: ProfessionalWalletPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  const balance = professional.walletBalance || 0;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await professionalAPI.getTransactions();
      if (response.transactions) {
        setTransactions(response.transactions);
        setTotalEarnings(response.totalEarnings || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;

    try {
      setWithdrawing(true);
      const bankDetails = {
        accountNumber: '1234567890', // À remplacer par un vrai formulaire
        bankName: 'Banque Example',
        accountHolder: professional.name
      };

      await professionalAPI.withdrawEarnings(parseFloat(withdrawAmount), bankDetails);
      setShowWithdraw(false);
      setWithdrawAmount('');
      // Recharger les données
      loadData();
    } catch (error) {
      console.error('Erreur lors du retrait:', error);
      alert('Erreur lors du retrait. Veuillez réessayer.');
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pb-10">
      <div className="bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 px-6 pt-8 pb-24 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <Logo size="sm" variant="white" />
        </div>
        <h1 className="text-white text-2xl mb-2">Mon Portefeuille</h1>
        <p className="text-white/80">Gérez vos gains et retraits</p>
      </div>

      <div className="px-6 -mt-16">
        {/* Carte de solde */}
        <div className="bg-gradient-to-br from-green-600 via-cyan-500 to-teal-500 rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">Solde disponible</p>
                <h2 className="text-white text-3xl">{balance.toLocaleString()} FCFA</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white/80 text-sm">Total gagné</span>
              </div>
              <p className="text-white text-xl">{totalEarnings.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-white" />
                <span className="text-white/80 text-sm">Consultations</span>
              </div>
              <p className="text-white text-xl">{transactions.length}</p>
            </div>
          </div>

          <button
            onClick={() => setShowWithdraw(true)}
            disabled={balance < 10000} // Minimum 10,000 FCFA pour retrait
            className="w-full py-4 bg-white text-green-600 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Banknote className="w-5 h-5" />
            Retirer mes gains
          </button>
        </div>

        {/* Historique des gains */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-800">Historique des gains</h3>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-500" />
                <p className="text-gray-500">Chargement des transactions...</p>
              </div>
            ) : (
              <>
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-gray-800">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 text-sm">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {transaction.status === 'completed' ? 'Payé' :
                           transaction.status === 'pending' ? 'En attente' : 'Échec'}
                        </span>
                      </div>
                    </div>
                    <div className="text-green-600 text-lg">
                      +{transaction.amount.toLocaleString()} FCFA
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun gain pour le moment
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de retrait */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl">Retirer mes gains</h3>
              <button onClick={() => setShowWithdraw(false)} className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Solde disponible: <span className="font-semibold">{balance.toLocaleString()} FCFA</span>
              </p>
              <label className="block text-gray-700 mb-2">Montant à retirer (FCFA)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Minimum 10,000 FCFA"
                min="10000"
                max={balance}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
              />
              <p className="text-gray-500 text-sm mt-2">
                Frais de retrait: 2% (minimum 500 FCFA)
              </p>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) < 10000 || parseFloat(withdrawAmount) > balance || withdrawing}
              className="w-full py-4 bg-gradient-to-r from-green-500 via-cyan-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {withdrawing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                `Retirer ${withdrawAmount ? `${parseFloat(withdrawAmount).toLocaleString()} FCFA` : ''}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}