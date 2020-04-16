const { config } = require('../constants');
const  { pickUnlearnt, generateRandomSample,  generateRandomNumber, generateData} = require('./helpers');

const generateOptions = (rawData, uuid) => {
    const selected = generateRandomSample(rawData, config.MAX_INDEX + 1);
    const filtered = selected.filter(i => i.cardId.uuid !== uuid);
    console.log('filtered', filtered);
    return filtered.slice(0, config.MAX_INDEX).map(i => i.cardId.name);
  };
  
const prepareGameData = rawData => {
    const gameId = 'definitionWord';
    const selected = pickUnlearnt({ rawData, config, gameId });
    const qa = selected.map(card => {
        const {audioUrl, uuid, name, index, defs} = card;
    //   const { pronunciation } = card;
    //   const audioUrl = pronunciation.length ? pronunciation[0].audioUrl : null;
      const options = generateOptions(rawData, uuid);
      console.log('options', options);
      options.splice(generateRandomNumber(options.length - 1), 0, name);
      return { a: name, q: defs[index], audioUrl, options };
    });
    const learntCards = generateData(selected);
    return {qa, learntCards, gameId};
  };

  module.exports = prepareGameData;