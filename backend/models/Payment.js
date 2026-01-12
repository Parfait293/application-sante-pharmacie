const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: {
    type: String,
    enum: ['moov', 'yas-togo', 'carte-bancaire'],
    required: true
  },
  phoneNumber: {
    type: String,
    required: function() {
      return ['moov', 'yas-togo'].includes(this.method);
    }
  },
  cardDetails: {
    lastFourDigits: String,
    expiryMonth: String,
    expiryYear: String,
    cardType: String
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
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

// Un utilisateur ne peut avoir qu'une méthode de paiement par défaut par type
paymentSchema.index({ user: 1, method: 1 }, { unique: true });

// Middleware pour mettre à jour updatedAt
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware pour s'assurer qu'il n'y a qu'une méthode par défaut
paymentSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, method: this.method, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);