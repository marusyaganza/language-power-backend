// Adds the game catalog to the database. Games that already exist (by name) are updated to match.
// Other games in the database are left untouched.
// Usage: yarn seed
require('dotenv').config();

const mongoose = require('mongoose');
const Game = require('../models/game');

// Names must match the ids in controllers/constants.js, because card scores are keyed by them.
// Configs are taken from controllers/games-controller/game-data-generator/__tests__/mocks/games.json.
// Logos are paths served by the static /uploads/images route.
const games = [
  {
    name: 'audio',
    title: 'WordEcho',
    description:
      'Listen, Type, Master. Sharpen language skills through auditory engagement.',
    logo: 'uploads/images/audio.jpg',
    logoW: 'uploads/images/audio.webp',
    config: {
      MAX_GAMES: 5,
      MIN_WORDS_IN_VOCAB: 1,
      WORDS_PER_GAME: 6,
      AUDIO_IS_REQUIRED: true,
      OPTIONS_NUM: 0,
      MULTIPLE_CORRECT_ANSWERS: false,
      QUESTION_PROP: 'audioUrl',
      ANSWER_PROP: 'name',
    },
  },
  {
    name: 'wordDefinition',
    title: 'LexiSense',
    description:
      'Define & Conquer. Match words with their meanings intuitively.',
    logo: 'uploads/images/wordDefinition.jpg',
    logoW: 'uploads/images/wordDefinition.webp',
    config: {
      MAX_GAMES: 5,
      MIN_WORDS_IN_VOCAB: 6,
      WORDS_PER_GAME: 6,
      AUDIO_IS_REQUIRED: false,
      OPTIONS_NUM: 6,
      MULTIPLE_CORRECT_ANSWERS: false,
      QUESTION_PROP: 'name',
      ANSWER_PROP: 'defs',
    },
  },
  {
    name: 'definitionWord',
    title: 'Definify: Match & Learn',
    description:
      'Associate definitions with the right words. A captivating word puzzle adventure!',
    logo: 'uploads/images/definitionWord.jpg',
    logoW: 'uploads/images/definitionWord.webp',
    config: {
      MAX_GAMES: 5,
      MIN_WORDS_IN_VOCAB: 6,
      WORDS_PER_GAME: 6,
      AUDIO_IS_REQUIRED: false,
      OPTIONS_NUM: 6,
      MULTIPLE_CORRECT_ANSWERS: false,
      QUESTION_PROP: 'defs',
      ANSWER_PROP: 'name',
    },
  },
  {
    name: 'writing',
    title: 'WordRecall: Define & Type',
    description:
      'Type words matching given definitions. Boost vocabulary in engaging rounds!',
    logo: 'uploads/images/writing.jpg',
    logoW: 'uploads/images/writing.webp',
    config: {
      MAX_GAMES: 5,
      MIN_WORDS_IN_VOCAB: 1,
      WORDS_PER_GAME: 6,
      AUDIO_IS_REQUIRED: false,
      OPTIONS_NUM: 0,
      MULTIPLE_CORRECT_ANSWERS: false,
      QUESTION_PROP: 'defs',
      ANSWER_PROP: 'name',
    },
  },
];

// Same connection logic as app.js
const dbUri =
  process.env.MONGO_URI ||
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

async function seed() {
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  for (const game of games) {
    const existing = await Game.findOne({ name: game.name });
    if (existing) {
      existing.set(game);
      await existing.save();
      console.log(`updated ${game.name}`);
    } else {
      await new Game(game).save();
      console.log(`added ${game.name}`);
    }
  }
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
