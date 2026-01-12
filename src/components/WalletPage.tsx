import { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, Plus, CreditCard, Smartphone, History as HistoryIcon, Check, X, Loader2 } from 'lucide-react';
import type { User, Transaction, PaymentMethod } from '../types';
import { Logo } from './Logo';
import { paymentAPI } from '../utils/api';

type WalletPageProps = {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
};

export function WalletPage({ user, onBack, onUpdateUser }: WalletPageProps) {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(user.telephone);
  const [cardNumber, setCardNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const balance = user.walletBalance || 0;

  // Charger les transactions au montage du composant
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getTransactions();
      if (response.transactions) {
        // Convertir les données backend vers le format frontend
        const formattedTransactions = response.transactions.map((t: any) => ({
          id: t._id,
          type: t.type,
          amount: t.amount,
          date: new Date(t.createdAt).toISOString().split('T')[0],
          status: t.status,
          description: t.description,
          paymentMethod: t.paymentMethod
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !selectedPaymentMethod) return;

    // paymentAPI.deposit only accepts mobile methods ('moov' | 'yas-togo').
    // Handle card payments separately (e.g. via a card-specific API) — for now show a message.
    if (selectedPaymentMethod === 'carte-bancaire') {
      alert("La recharge par carte bancaire n'est pas encore supportée dans cette version.");
      return;
    }

    try {
      setDepositing(true);
      const depositData: { amount: number; method: 'moov' | 'yas-togo'; phoneNumber: string } = {
        amount: parseFloat(amount),
        method: selectedPaymentMethod as 'moov' | 'yas-togo',
        phoneNumber: phoneNumber
      };

      const response = await paymentAPI.deposit(depositData);

      if (response.transaction) {
        setShowSuccess(true);
        setAmount('');
        setSelectedPaymentMethod(null);
        // Recharger les transactions après un court délai
        setTimeout(() => {
          loadTransactions();
          setShowSuccess(false);
          setShowAddMoney(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors du dépôt:', error);
      alert('Erreur lors du dépôt. Veuillez réessayer.');
    } finally {
      setDepositing(false);
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
        <p className="text-white/80">Gérez votre solde électronique</p>
      </div>

      <div className="px-6 -mt-16">
        {/* Carte de solde */}
        <div className="bg-gradient-to-br from-purple-600 via-cyan-500 to-teal-500 rounded-3xl shadow-2xl p-8 mb-6">
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
          
          <button
            onClick={() => setShowAddMoney(true)}
            className="w-full py-4 bg-white text-purple-600 rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Recharger le portefeuille
          </button>
        </div>

        {/* Historique des transactions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <HistoryIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-800">Historique des transactions</h3>
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
                          {transaction.status === 'completed' ? 'Terminé' :
                           transaction.status === 'pending' ? 'En cours' : 'Échec'}
                        </span>
                      </div>
                    </div>
                    <div className={`${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} FCFA
                    </div>
                  </div>
                ))}

                {transactions.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    Aucune transaction pour le moment
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'argent */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-800 text-xl">Recharger le portefeuille</h3>
              <button onClick={() => setShowAddMoney(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!showSuccess ? (
              <>
                {/* Montant */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Montant (FCFA)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ex: 10000"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Méthodes de paiement */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-3">Méthode de paiement</label>
                  <div className="space-y-3">
                    {/* Moov Money */}
                    <button
                      onClick={() => setSelectedPaymentMethod('moov')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedPaymentMethod === 'moov'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-800">Moov Money</p>
                          <p className="text-gray-500 text-sm">Paiement mobile</p>
                        </div>
                        {selectedPaymentMethod === 'moov' && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Yas Togo */}
                    <button
                      onClick={() => setSelectedPaymentMethod('yas-togo')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedPaymentMethod === 'yas-togo'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-800">Yas Togo</p>
                          <p className="text-gray-500 text-sm">Paiement mobile</p>
                        </div>
                        {selectedPaymentMethod === 'yas-togo' && (
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Carte bancaire */}
                    <button
                      onClick={() => setSelectedPaymentMethod('carte-bancaire')}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedPaymentMethod === 'carte-bancaire'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-800">Carte bancaire</p>
                          <p className="text-gray-500 text-sm">Visa, Mastercard</p>
                        </div>
                        {selectedPaymentMethod === 'carte-bancaire' && (
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Détails selon la méthode */}
                {selectedPaymentMethod && selectedPaymentMethod !== 'carte-bancaire' && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Numéro de téléphone</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+228 90 12 34 56"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {selectedPaymentMethod === 'carte-bancaire' && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Numéro de carte</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <button
                  onClick={handleDeposit}
                  disabled={!amount || !selectedPaymentMethod || depositing}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {depositing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    `Recharger ${amount ? `${parseFloat(amount).toLocaleString()} FCFA` : ''}`
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-gray-800 mb-2">Rechargement réussi !</h3>
                <p className="text-gray-600">
                  Votre portefeuille a été crédité de {parseFloat(amount).toLocaleString()} FCFA
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
