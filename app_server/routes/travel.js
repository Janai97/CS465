const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../app_api/models/travlr');
const Trip = mongoose.model('trips');

router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({}).sort({ code: 1 }).lean().exec();
    res.render('travel', {
      title: 'Travlr Getaways | Travel',
      trips: trips || [],
    });
  } catch (err) {
    res.render('travel', {
      title: 'Travlr Getaways | Travel',
      trips: [],
      message: 'Error loading trips.',
    });
  }
});

router.post('/add-to-cart', async (req, res) => {
  const tripCode = req.body.tripCode;
  if (!tripCode) return res.redirect('/travel');

  const trip = await Trip.findOne({ code: tripCode }).lean().exec();
  if (!trip) return res.redirect('/travel');

  if (!req.session.cart) req.session.cart = [];

  const existing = req.session.cart.find((x) => x.code === trip.code);
  if (existing) existing.qty += 1;
  else {
    req.session.cart.push({
      code: trip.code,
      name: trip.name,
      perPerson: trip.perPerson,
      image: trip.image,
      qty: 1,
    });
  }

  res.redirect('/checkout');
});

module.exports = router;