const express = require('express');
const Appointment = require('../models/Appointment');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');

const router = express.Router();

// Obtenir les rendez-vous de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('professional')
      .sort({ date: 1, time: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Créer un rendez-vous
router.post('/', auth, async (req, res) => {
  try {
    const { professionalId, date, time, type, notes } = req.body;

    // Vérifier si le professionnel existe et est disponible
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    // Vérifier si le créneau est disponible (simplifié)
    const existingAppointment = await Appointment.findOne({
      professional: professionalId,
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    // Vérifier le solde de l'utilisateur
    if (req.user.walletBalance < professional.consultationFee) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Créer le rendez-vous
    const appointment = new Appointment({
      user: req.user._id,
      professional: professionalId,
      date,
      time,
      type,
      consultationFee: professional.consultationFee,
      notes
    });

    await appointment.save();

    // Déduire du portefeuille (retenue pour paiement)
    await require('../models/User').findByIdAndUpdate(req.user._id, {
      $inc: { walletBalance: -professional.consultationFee }
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('professional');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mettre à jour le rendez-vous
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes, confirmPayment } = req.body;
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('professional');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Mettre à jour les champs
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;

    // Gérer la confirmation du paiement
    if (confirmPayment && status === 'completed' && !appointment.isPaid) {
      appointment.isPaid = true;

      // Créditer le portefeuille du professionnel
      await require('../models/Professional').findByIdAndUpdate(appointment.professional._id, {
        $inc: { walletBalance: appointment.consultationFee }
      });

      // Créer un enregistrement de transaction pour le paiement
      const Transaction = require('../models/Transaction');
      const transaction = new Transaction({
        user: req.user._id,
        type: 'consultation',
        amount: -appointment.consultationFee,
        status: 'completed',
        description: `Consultation ${appointment.professional.name} - ${appointment.professional.specialty}`,
        metadata: { appointmentId: appointment._id }
      });
      await transaction.save();
    }

    await appointment.save();

    // Si annulé avant paiement, rembourser
    if (status === 'cancelled' && !appointment.isPaid) {
      await require('../models/User').findByIdAndUpdate(req.user._id, {
        $inc: { walletBalance: appointment.consultationFee }
      });
    }

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtenir un rendez-vous par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('professional');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;