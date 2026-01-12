const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'consultation', 'medication', 'refund', 'withdrawal'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['moov', 'yas-togo', 'carte-bancaire', 'especes'],
    required: function() {
      return this.type === 'deposit';
    }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String, // Référence de transaction de l'opérateur
    unique: true,
    sparse: true
  },
  externalTransactionId: {
    type: String, // ID de transaction externe
    sparse: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Données supplémentaires (numéro de téléphone, etc.)
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour optimiser les recherches
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ externalTransactionId: 1 });

// Middleware pour mettre à jour updatedAt
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);