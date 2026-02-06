const express = require('express');
const Professional = require('../models/Professional');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware pour vérifier si l'utilisateur est un professionnel (simplifié)
const requireProfessional = async (req, res, next) => {
  try {
    const professional = await Professional.findOne({ email: req.user.email });
    if (!professional) {
      return res.status(403).json({ message: 'Access denied. Professional account required.' });
    }
    req.professional = professional;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Obtenir le profil et le portefeuille du professionnel
router.get('/profile', auth, requireProfessional, async (req, res) => {
  try {
    res.json({
      professional: req.professional,
      walletBalance: req.professional.walletBalance
    });
  } catch (error) {
    console.error('Get professional profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtenir les gains/transactions du professionnel
router.get('/transactions', auth, requireProfessional, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Trouver les transactions liées aux rendez-vous de ce professionnel
    const transactions = await Transaction.find({
      type: 'consultation',
      'metadata.appointmentId': { $exists: true }
    })
    .populate({
      path: 'metadata.appointmentId',
      populate: { path: 'professional' }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Filtrer les transactions pour ce professionnel
    const professionalTransactions = transactions.filter(t =>
      t.metadata?.appointmentId?.professional?._id.toString() === req.professional._id.toString()
    );

    // Convertir en montants positifs pour les gains
    const earnings = professionalTransactions.map(t => ({
      ...t.toObject(),
      amount: Math.abs(t.amount) // Show as positive for earnings
    }));

    res.json({
      transactions: earnings,
      totalEarnings: earnings.reduce((sum, t) => sum + t.amount, 0)
    });
  } catch (error) {
    console.error('Get professional transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Retirer les gains (simplifié - serait intégré avec l'API bancaire)
router.post('/withdraw', auth, requireProfessional, async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;

    if (req.professional.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Créer une transaction de retrait
    const transaction = new Transaction({
      user: req.professional._id, // Utiliser l'ID du professionnel comme utilisateur pour le suivi
      type: 'withdrawal',
      amount: -amount,
      status: 'pending',
      description: 'Retrait de gains',
      metadata: { bankDetails, professionalId: req.professional._id }
    });

    await transaction.save();

    // Déduire du portefeuille du professionnel
    await Professional.findByIdAndUpdate(req.professional._id, {
      $inc: { walletBalance: -amount }
    });

    res.json({
      message: 'Demande de retrait initiée',
      transaction
    });
  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtenir les rendez-vous du professionnel avec le statut de paiement
router.get('/appointments', auth, requireProfessional, async (req, res) => {
  try {
    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({
      'professional': req.professional._id
    })
    .populate('user', 'nom prenom telephone')
    .sort({ date: -1, time: -1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get professional appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;