const express = require('express');
const Payment = require('../models/Payment');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Configuration des opérateurs mobiles (simulé)
const OPERATOR_CONFIGS = {
  moov: {
    name: 'Moov Money',
    apiUrl: process.env.MOOV_API_URL || 'https://api.moov.tg',
    apiKey: process.env.MOOV_API_KEY,
    fees: 0.02 // 2% de frais
  },
  'yas-togo': {
    name: 'Yas-Togo',
    apiUrl: process.env.YAS_API_URL || 'https://api.yas.tg',
    apiKey: process.env.YAS_API_KEY,
    fees: 0.015 // 1.5% de frais
  }
};

// Ajouter une méthode de paiement
router.post('/methods', auth, async (req, res) => {
  try {
    const { method, phoneNumber, cardDetails, isDefault } = req.body;

    // Validation selon la méthode
    if (['moov', 'yas-togo'].includes(method) && !phoneNumber) {
      return res.status(400).json({ message: 'Numéro de téléphone requis pour les paiements mobiles' });
    }

    if (method === 'carte-bancaire' && !cardDetails) {
      return res.status(400).json({ message: 'Détails de carte requis' });
    }

    // Créer la méthode de paiement
    const payment = new Payment({
      user: req.user._id,
      method,
      phoneNumber,
      cardDetails,
      isDefault: isDefault || false,
      isVerified: method === 'carte-bancaire' ? false : true // Simulé comme vérifié pour mobile
    });

    await payment.save();

    res.status(201).json({
      message: 'Méthode de paiement ajoutée',
      payment
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir les méthodes de paiement de l'utilisateur
router.get('/methods', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id });
    res.json({ payments });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une méthode de paiement
router.delete('/methods/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!payment) {
      return res.status(404).json({ message: 'Méthode de paiement non trouvée' });
    }

    res.json({ message: 'Méthode de paiement supprimée' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Déposer de l'argent via opérateur mobile
router.post('/deposit', auth, async (req, res) => {
  try {
    const { amount, method, phoneNumber } = req.body;

    if (!['moov', 'yas-togo'].includes(method)) {
      return res.status(400).json({ message: 'Méthode de paiement non supportée pour les dépôts' });
    }

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Numéro de téléphone requis' });
    }

    const config = OPERATOR_CONFIGS[method];
    const fees = amount * config.fees;
    const netAmount = amount - fees;

    // Simuler l'appel à l'API de l'opérateur
    const reference = `DEP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Créer la transaction
    const transaction = new Transaction({
      user: req.user._id,
      type: 'deposit',
      amount: netAmount,
      paymentMethod: method,
      status: 'pending',
      description: `Dépôt via ${config.name}`,
      reference,
      metadata: {
        phoneNumber,
        grossAmount: amount,
        fees
      }
    });

    await transaction.save();

    // Simuler la validation de paiement (dans un vrai système, ce serait asynchrone)
    setTimeout(async () => {
      try {
        // Mettre à jour le solde utilisateur
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { walletBalance: netAmount }
        });

        // Marquer la transaction comme complétée
        await Transaction.findByIdAndUpdate(transaction._id, {
          status: 'completed'
        });
      } catch (error) {
        console.error('Payment processing error:', error);
        await Transaction.findByIdAndUpdate(transaction._id, {
          status: 'failed'
        });
      }
    }, 2000); // Simuler 2 secondes de traitement

    res.json({
      message: 'Demande de dépôt initiée',
      transaction: {
        id: transaction._id,
        reference,
        amount: netAmount,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Effectuer un paiement (consultation, médicaments)
router.post('/pay', auth, async (req, res) => {
  try {
    const { amount, description, type, relatedId } = req.body;

    if (req.user.walletBalance < amount) {
      return res.status(400).json({ message: 'Solde insuffisant' });
    }

    // Créer la transaction
    const transaction = new Transaction({
      user: req.user._id,
      type,
      amount: -amount, // négatif pour les dépenses
      status: 'completed',
      description,
      metadata: { relatedId }
    });

    await transaction.save();

    // Mettre à jour le solde
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { walletBalance: -amount }
    });

    res.json({
      message: 'Paiement effectué',
      transaction
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir l'historique des transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const query = { user: req.user._id };
    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'nom prenom');

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Vérifier le statut d'une transaction
router.get('/transactions/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Webhook pour recevoir les confirmations de paiement des opérateurs
router.post('/webhook/:operator', async (req, res) => {
  try {
    const { operator } = req.params;
    const { reference, status, externalId } = req.body;

    // Vérifier la signature du webhook (dans un vrai système)

    const transaction = await Transaction.findOne({ reference });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction non trouvée' });
    }

    if (status === 'success') {
      // Mettre à jour le solde utilisateur
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { walletBalance: transaction.amount }
      });

      transaction.status = 'completed';
    } else {
      transaction.status = 'failed';
    }

    transaction.externalTransactionId = externalId;
    await transaction.save();

    res.json({ message: 'Webhook traité' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;