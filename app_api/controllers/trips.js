const mongoose = require('mongoose');
require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

/* GET - LISTS ALL TRIPS */
const tripsList = async (req, res) => {
  try {
    const trips = await Model.find({}).exec();

    if (!trips.length) {
      return res.status(404).json({ message: 'No trips found' });
    }

    return res.status(200).json(trips);
  } catch (err) {
    return res.status(500).json(err);
  }
};

/* GET - SINGLE TRIP */
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Model.findOne({ code: req.params.tripCode }).exec();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (err) {
    return res.status(500).json(err);
  }
};

/* POST - CREATE NEW TRIP */
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
      description: req.body.description,
    });

    return res.status(201).json(newTrip);
  } catch (err) {
    return res.status(400).json(err);
  }
};

/* PUT - UPDATE EXISTING TRIP */
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
        description: req.body.description,
      },
      {
        new: true,          // return updated doc
        runValidators: true // validate against schema
      }
    ).exec();

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(updatedTrip);
  } catch (err) {
    return res.status(400).json(err);
  }
};

/* DELETE */
const tripsDeleteTrip = async (req, res) => {
  try {
    const trip = await Model.findOneAndDelete({ code: req.params.tripCode }).exec();

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json(err);
  }
};


/* EXPORTS */
module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip,
};