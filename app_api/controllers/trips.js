const mongoose = require('mongoose');
require('../models/travlr'); // Register model
const Model = mongoose.model('trips');


// =====================================================
// GET: /api/trips - lists all the trips
// =====================================================
const tripsList = async (req, res) => {
  try {
    const trips = await Model.find({}).exec();

    if (!trips.length) {
      return res.status(404).json({ message: "No trips found" });
    }

    return res.status(200).json(trips);

  } catch (err) {
    return res.status(500).json(err);
  }
};


// =====================================================
// GET: /api/trips/:tripCode - retrieve a single trip
// =====================================================
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Model.findOne({ code: req.params.tripCode }).exec();

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.status(200).json(trip);

  } catch (err) {
    return res.status(500).json(err);
  }
};


// =====================================================
// POST: /api/trips - create a new trip
// =====================================================
const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = await Model.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    return res.status(201).json(newTrip);

  } catch (err) {
    return res.status(400).json(err);
  }
};


// =====================================================
// PUT: /api/trips/:tripCode - update an existing trip
// =====================================================
const tripsUpdateTrip = async (req, res) => {
  try {
    const updatedTrip = await Model.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true } // return the updated doc
    ).exec();

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    return res.status(200).json(updatedTrip);

  } catch (err) {
    return res.status(400).json(err);
  }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
