const { config } = require('../../constants');
const  { pickUnlearnt, generateRandomSample,  generateRandomNumber, generateData} = require('../helpers');

const generateOptions = (rawData, uuid) => {
    const selected = rawData.length === config.MIN_WORDS ? rawData 
    : generateRandomSample(rawData, config.MAX_INDEX + 1);
    const filtered = selected.filter(i => i.card.uuid !== uuid);
    return filtered.slice(0, config.MAX_INDEX).map(i => i.card.name);
  };
  
const prepareGameData = rawData => {
    const gameId = 'definitionWord';
    if(rawData.length < config.MIN_WORDS) {
      return {qa:[], message: `You need to have at least ${config.MIN_WORDS} words to play this game`}
    }
    const selected = pickUnlearnt({ rawData, config, gameId });
    const qa = selected.map(card => {
        const {audioUrl, uuid, name, index, defs} = card;
      const options = generateOptions(rawData, uuid);
      options.splice(generateRandomNumber(options.length - 1), 0, name);
      return { a: name, q: defs[index], audioUrl, options };
    });
    const learntCards = generateData(selected);
    return {qa, learntCards, gameId};
  };

  module.exports = prepareGameData;