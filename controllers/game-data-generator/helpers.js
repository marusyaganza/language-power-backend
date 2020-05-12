const generateRandomNumber = max => Math.floor(Math.random() * max);
const generateRandomArray = (max, size) => {
  const result = [];
  let currentNum;
  while (result.length < size) {
    currentNum = generateRandomNumber(max);
    if (!result.includes(currentNum)) {
      result.push(currentNum);
    }
  }
  return result;
};

const generateRandomSample = (data, size) => {
  const indexes = generateRandomArray(data.length - 1, size);
  return indexes.map(elem => data[elem]);
};

const pickUnlearnt = ({ rawData, gameId, config }) => {
    const unlearnt = rawData.filter(item =>
      item.score[gameId] && item.score[gameId].some(i => i < config.MAX_GAMES) 
    );
    const {WORDS_PER_GAME} = config;
    let candidates;
    if (unlearnt.length <= WORDS_PER_GAME) {
      candidates = unlearnt;
    } else {
      candidates = generateRandomSample(unlearnt, WORDS_PER_GAME);
    }
  const groomed = candidates.map(candidate => {
    const card = candidate.card;
      const defsIndexes = candidate.score[gameId]
      .map((played, i) => {return {played, i}})
      .filter(def => def.played < config.MAX_GAMES);
      const randNum = generateRandomNumber(defsIndexes.length);
      const index = defsIndexes[randNum].i;
      const { pronunciation, defs, name, id, uuid, particle } = card;
      const audioUrl = pronunciation ? pronunciation.audioUrl : null;
      return {cardId: id, audioUrl, name, index, defs, particle, uuid, id: candidate.id};
  });
  return groomed;
};

function generateData (rawData) {
  return rawData.map(datum => {
    const {index} = datum;
     return {index, id: datum.id}
    });
}

exports.generateRandomSample = generateRandomSample;
exports.pickUnlearnt = pickUnlearnt;
exports.generateRandomNumber = generateRandomNumber;
exports.generateData = generateData;
exports.generateRandomArray = generateRandomArray;