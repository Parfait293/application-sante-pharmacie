const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Mettre à jour le profil de l'utilisateur - accepte JSON avec photo base64 optionnelle
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = req.user;

    // Gérer la photo base64 (envoyée en JSON)
    if (updates.photo && updates.photo.startsWith('data:image')) {
      // La photo est déjà au format base64, l'utiliser directement
      updates.photo = updates.photo;
    } else if (updates.photo === null || updates.photo === undefined) {
      // Ne pas mettre à jour la photo si non fournie
      delete updates.photo;
    }

    // Supprimer les champs qui ne devraient pas être mis à jour directement
    delete updates.password;
    delete updates.walletBalance;
    delete updates._id;
    delete updates.createdAt;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Mettre à jour le solde du portefeuille (admin ou système uniquement)
router.put('/wallet', auth, async (req, res) => {
  try {
    const { amount, operation } = req.body; // opération : 'add' ou 'subtract'
    const user = req.user;

    let newBalance = user.walletBalance;
    if (operation === 'add') {
      newBalance += amount;
    } else if (operation === 'subtract') {
      newBalance -= amount;
      if (newBalance < 0) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { walletBalance: newBalance, updatedAt: Date.now() },
      { new: true }
    );

    res.json({
      message: 'Wallet updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Changer le mot de passe
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Vérifier le mot de passe actuel
    const isMatch = await require('bcryptjs').compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hacher le nouveau mot de passe
    const salt = await require('bcryptjs').genSalt(10);
    const hashedPassword = await require('bcryptjs').hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtenir l'utilisateur par ID (pour admin ou profil public)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

