const path = require('path');
const fs = require('fs');

// Bring in DB + model
const mongoose = require('./db');
const Trip = require('./travlr');

function loadTripsJson() {
  // Common places people put trips.json in this project
  const candidates = [
    // You said: app_server/data/trips.json
    path.join(__dirname, '..', '..', 'app_server', 'data', 'trips.json'),

    // If you accidentally made it in app_server/data/data/trips.json
    path.join(__dirname, '..', '..', 'app_server', 'data', 'data', 'trips.json'),

    // If you later add it under app_api/data/trips.json
    path.join(__dirname, '..', 'data', 'trips.json'),

    // Fallback: relative to where you run node from
    path.join(process.cwd(), 'app_server', 'data', 'trips.json'),
    path.join(process.cwd(), 'data', 'trips.json'),
  ];

  console.log('Seed starting...');
  console.log('process.cwd() =', process.cwd());
  console.log('__dirname      =', __dirname);
  console.log('Looking for trips.json in:');
  candidates.forEach((p) => console.log(' -', p));

  const found = candidates.find((p) => fs.existsSync(p));

  if (!found) {
    throw new Error(
      'Could not find trips.json. Create it in app_server/data/trips.json (or one of the paths printed above).'
    );
  }

  const raw = fs.readFileSync(found, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(`trips.json at ${found} is not a JSON array.`);
  }

  console.log('Using trips file:', found);
  console.log('Trip count in JSON:', parsed.length);

  return parsed;
}

const seedDB = async () => {
  const trips = loadTripsJson();

  await Trip.deleteMany({});
  await Trip.insertMany(trips);

  console.log('✅ Seed complete. Inserted:', trips.length);
};

seedDB()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Seed failed:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  });