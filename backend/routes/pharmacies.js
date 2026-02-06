const express = require('express');
const Pharmacy = require('../models/Pharmacy');

const router = express.Router();

// Get all pharmacies
router.get('/', async (req, res) => {
  try {
    const { medicine, lat, lng } = req.query;

    let query = { isActive: true };

    // Filter by medicine if provided
    if (medicine) {
      query.availableMedicines = { $in: [medicine] };
    }

    const pharmacies = await Pharmacy.find(query);

    // Calculate distances if user location provided
    if (lat && lng) {
      pharmacies.forEach(pharmacy => {
        if (pharmacy.lat && pharmacy.lng) {
          const distance = calculateDistance(
            parseFloat(lat),
            parseFloat(lng),
            pharmacy.lat,
            pharmacy.lng
          );
          pharmacy.distance = distance;
        }
      });

      // Sort by distance
      pharmacies.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    res.json({ pharmacies });
  } catch (error) {
    console.error('Get pharmacies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pharmacy by ID
router.get('/:id', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    res.json({ pharmacy });
  } catch (error) {
    console.error('Get pharmacy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search pharmacies by medicine
router.get('/search/:medicine', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({
      availableMedicines: { $in: [req.params.medicine] },
      isActive: true
    });

    res.json({ pharmacies });
  } catch (error) {
    console.error('Search pharmacies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fonction utilitaire pour calculer la distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Rayon de la terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d;
}

module.exports = router;