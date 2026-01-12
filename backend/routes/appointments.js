const express = require('express');
const Appointment = require('../models/Appointment');
const Professional = require('../models/Professional');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's appointments
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

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { professionalId, date, time, type, notes } = req.body;

    // Check if professional exists and is available
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    // Check if slot is available (simplified)
    const existingAppointment = await Appointment.findOne({
      professional: professionalId,
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    // Check user balance
    if (req.user.walletBalance < professional.consultationFee) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create appointment
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

    // Deduct from wallet (hold for payment)
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

// Update appointment
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

    // Update fields
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;

    // Handle payment confirmation
    if (confirmPayment && status === 'completed' && !appointment.isPaid) {
      appointment.isPaid = true;

      // Credit the professional's wallet
      await require('../models/Professional').findByIdAndUpdate(appointment.professional._id, {
        $inc: { walletBalance: appointment.consultationFee }
      });

      // Create transaction record for the payment
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

    // If cancelled before payment, refund
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

// Get appointment by ID
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