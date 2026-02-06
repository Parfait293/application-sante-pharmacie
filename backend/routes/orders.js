const express = require('express');
const multer = require('multer');
const path = require('path');
const Order = require('../models/Order');
const Pharmacy = require('../models/Pharmacy');
const auth = require('../middleware/auth');

const router = express.Router();

// Configurer multer pour les téléchargements d'ordonnances
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/prescriptions/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image and PDF files are allowed!'));
  }
});

// Obtenir les commandes de l'utilisateur
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('pharmacy')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Créer une commande
router.post('/', auth, upload.single('prescription'), async (req, res) => {
  try {
    const { pharmacyId, medication, quantity, deliveryAddress, notes } = req.body;

    // Vérifier si la pharmacie existe
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    // Vérifier si le médicament est disponible
    if (!pharmacy.availableMedicines.includes(medication)) {
      return res.status(400).json({ message: 'Medicine not available at this pharmacy' });
    }

    // Calculer le prix (simplifié)
    const price = 5000 * quantity; // Fixed price per unit

    // Vérifier le solde
    if (req.user.walletBalance < price) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Créer la commande
    const order = new Order({
      user: req.user._id,
      pharmacy: pharmacyId,
      medication,
      quantity,
      price,
      prescription: req.file ? `/uploads/prescriptions/${req.file.filename}` : undefined,
      deliveryAddress,
      notes
    });

    await order.save();

    // Déduire du portefeuille
    await require('../models/User').findByIdAndUpdate(req.user._id, {
      $inc: { walletBalance: -price }
    });

    const populatedOrder = await Order.findById(order._id).populate('pharmacy');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mettre à jour le statut de la commande
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    // Si annulé, rembourser
    if (status === 'cancelled' && !order.isPaid) {
      await require('../models/User').findByIdAndUpdate(req.user._id, {
        $inc: { walletBalance: order.price }
      });
    }

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtenir une commande par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('pharmacy');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;