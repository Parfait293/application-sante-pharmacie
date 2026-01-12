const express = require('express');
const axios = require('axios');

const router = express.Router();

// Search medicines using RxNorm API
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.length < 3) {
      return res.json({ medicines: [] });
    }

    const response = await axios.get(
      `${process.env.RXNAV_API_BASE}/drugs.json?name=${encodeURIComponent(name)}`
    );

    const medicines = response.data.drugGroup?.conceptGroup?.[0]?.conceptProperties?.map(p => p.name) || [];

    res.json({ medicines: medicines.slice(0, 10) });
  } catch (error) {
    console.error('Search medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get medicine details
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;

    // For now, return basic info
    // In production, you might want to cache or use more detailed API
    res.json({
      name,
      description: `Information sur ${name}`,
      // Add more fields as needed
    });
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;