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
      const index = candidate.score[gameId].findIndex(i => i < config.MAX_GAMES);
      const { pronunciation, defs, name, id, uuid } = card;
      const audioUrl = pronunciation.length ? pronunciation[0].audioUrl : null;
      return {cardId: id, audioUrl, name, index, defs, uuid, id: candidate.id};
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