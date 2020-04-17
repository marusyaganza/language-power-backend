const { config } = require('../../constants');
const  { pickUnlearnt, generateRandomSample,  generateRandomNumber, generateData} = require('../helpers');

const generateOptions = (rawData, uuid, optionsNum) => {
    const selected = generateRandomSample(rawData, optionsNum + 1);
    const filtered = selected.filter(i => i.card.uuid !== uuid);
    return filtered
    .slice(0, optionsNum)
    .map(i => {
      const {defs} = i.card;
      const index = generateRandomNumber(defs.length - 1);
      return defs[index];
    });
  };
  
const prepareGameData = rawData => {
    const gameId = 'findAllDefs';
    if(rawData.length < config.MIN_WORDS) {
      return {qa:[], message: `You need to have at least ${config.MIN_WORDS} words to play this game`}
    }
    const selected = pickUnlearnt({ rawData, config, gameId });
    const qa = selected.map(card => {
        const {audioUrl, uuid, name, defs} = card;
      const options = generateOptions(rawData, uuid, config.MAX_INDEX - defs.length);
      defs.forEach(def => {
        options.splice(generateRandomNumber(config.MAX_INDEX - 1), 0, def);
      })
      return { a: defs, q: name, audioUrl, options };
    });
    const learntCards = generateData(selected);
    return {qa, learntCards, gameId};
  };

  module.exports = prepareGameData;