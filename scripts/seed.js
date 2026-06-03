/* eslint-disable no-console */
/**
 * Seed Calgary skate spots into MongoDB.
 *
 * Usage:
 *   npm run db:seed              # add pins (keeps existing data)
 *   npm run db:seed -- --reset   # delete all pins, then seed
 *   npm run db:seed -- --count=40
 *   npm run db:seed -- --fix-images   # set all pins to the default image
 */
require('dotenv').config();

const mongoose = require('mongoose');
const Pin = require('../models/Pin');
const User = require('../models/User');

const CALGARY_BOUNDS = {
  latMin: 50.9,
  latMax: 51.12,
  lngMin: -114.22,
  lngMax: -113.98,
};

const SPOT_TITLES = [
  'Shaw Millennium Park',
  'Olympic Plaza Ledges',
  'Devonian Gardens Gap',
  'Prince\'s Island Manual Pad',
  'East Village Plaza',
  'Crossroads DIY',
  'Chinook Ledges',
  'Southcentre Flatground',
  'Saddledome Stairs',
  'Bridgeland Banks',
  'Kensington Curb Cut',
  'Mission Riverfront Ledge',
  '17th Ave Flat',
  'Sunalta Hill Bomb',
  'Bowness DIY',
  'Tuscany Skate Spot',
  'Forest Lawn Plaza',
  'Marlborough Park Ledge',
  'Fish Creek Rails',
  'Stephen Avenue Blocks',
  'Eau Claire Plaza',
  'Stampede Park Ledge',
  'Inglewood Bump to Bar',
  'Killarney Skate Pad',
  'Glenmore Landing Stairs',
  'Lake Bonavista Gap',
  'Royal Oak Hubba',
  'Cranston Manual Pad',
  'Auburn Bay Flatground',
  'Legacy Skate Ledge',
];

const SPOT_NOTES = [
  'Smooth ground, low bust factor before 9am.',
  'Bring wax. Cracks after rain.',
  'Night session friendly with lights nearby.',
  'Helmet recommended on the roll-in.',
  'Crowded on weekends — early morning best.',
  'DIY spot — respect the locals.',
  'Short run-up, good for beginners.',
  'Ground is a bit rough on the landing.',
  'Security sometimes patrols in summer.',
  'Legendary YYC spot. Share the space.',
];

// Same path as client/public/default_image.png (resolved by the Vite app origin)
const DEFAULT_PIN_IMAGE = '/default_image.png';
const DEFAULT_AVATAR = '/default_avatar.png';

const SEED_USER = {
  name: 'YYC Skatespots',
  email: 'seed@skatespot.local',
  picture: DEFAULT_AVATAR,
};

function parseArgs(argv) {
  const reset = argv.includes('--reset');
  const fixImages = argv.includes('--fix-images');
  const countArg = argv.find((a) => a.startsWith('--count='));
  const count = countArg ? Math.min(100, Math.max(1, parseInt(countArg.split('=')[1], 10))) : 25;
  return { reset, fixImages, count };
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomCalgaryCoords() {
  return {
    latitude: Number(randomInRange(CALGARY_BOUNDS.latMin, CALGARY_BOUNDS.latMax).toFixed(6)),
    longitude: Number(randomInRange(CALGARY_BOUNDS.lngMin, CALGARY_BOUNDS.lngMax).toFixed(6)),
  };
}

function buildPin(authorId, index) {
  const baseTitle = pick(SPOT_TITLES);
  const { latitude, longitude } = randomCalgaryCoords();
  const daysAgo = Math.floor(Math.random() * 90);
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

  return {
    title: `${baseTitle} #${index + 1}`,
    content: pick(SPOT_NOTES),
    image: DEFAULT_PIN_IMAGE,
    latitude,
    longitude,
    author: authorId,
    comments: [],
    createdAt,
    updatedAt: createdAt,
  };
}

async function ensureSeedUser() {
  let user = await User.findOne({ email: SEED_USER.email });
  if (!user) {
    user = await User.create(SEED_USER);
    console.log(`Created seed user: ${user.name} (${user._id})`);
  } else {
    console.log(`Using existing seed user: ${user.name} (${user._id})`);
  }
  return user;
}

async function seed() {
  const { reset, fixImages, count } = parseArgs(process.argv.slice(2));

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Copy .env.example to .env first.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  if (fixImages) {
    const updated = await Pin.updateMany({}, { $set: { image: DEFAULT_PIN_IMAGE } });
    console.log(`Set default image on ${updated.modifiedCount} pin(s)`);
    await mongoose.disconnect();
    return;
  }

  if (reset) {
    const deleted = await Pin.deleteMany({});
    console.log(`Removed ${deleted.deletedCount} existing pin(s)`);
  }

  const author = await ensureSeedUser();
  const pins = Array.from({ length: count }, (_, i) => buildPin(author._id, i));
  const inserted = await Pin.insertMany(pins);

  console.log(`Seeded ${inserted.length} skate spot(s) in Calgary, AB`);
  console.log(
    `Bounds: lat ${CALGARY_BOUNDS.latMin}–${CALGARY_BOUNDS.latMax}, lng ${CALGARY_BOUNDS.lngMin}–${CALGARY_BOUNDS.lngMax}`,
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
