const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update user profile - accepts JSON with optional base64 photo
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = req.user;

    // Handle base64 photo (sent as JSON)
    if (updates.photo && updates.photo.startsWith('data:image')) {
      // Photo is already in base64 format, use it directly
      updates.photo = updates.photo;
    } else if (updates.photo === null || updates.photo === undefined) {
      // Don't update photo if not provided
      delete updates.photo;
    }

    // Remove fields that shouldn't be updated directly
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

// Update wallet balance (admin or system only)
router.put('/wallet', auth, async (req, res) => {
  try {
    const { amount, operation } = req.body; // operation: 'add' or 'subtract'
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

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verify current password
    const isMatch = await require('bcryptjs').compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await require('bcryptjs').genSalt(10);
    const hashedPassword = await require('bcryptjs').hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (for admin or public profile)
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

