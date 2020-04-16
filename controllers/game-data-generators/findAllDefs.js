const { config } = require('../constants');
const  { pickUnlearnt, generateRandomSample,  generateRandomNumber, generateData} = require('./helpers');

const generateOptions = (rawData, uuid, optionsNum) => {
    const selected = generateRandomSample(rawData, optionsNum + 1);
    const filtered = selected.filter(i => i.cardId.uuid !== uuid);
    // console.log('filtered', filtered);
    return filtered
    .slice(0, optionsNum)
    .map(i => {
      const {defs} = i.cardId;
      const index = generateRandomNumber(defs.length - 1);
      return defs[index];
    });
  };
  
const prepareGameData = rawData => {
    const gameId = 'definitionWord';
    const selected = pickUnlearnt({ rawData, config, gameId });
    const qa = selected.map(card => {
        const {audioUrl, uuid, name, index, defs} = card;
    //   const { pronunciation } = card;
    //   const audioUrl = pronunciation.length ? pronunciation[0].audioUrl : null;
      const options = generateOptions(rawData, uuid, config.MAX_INDEX - defs.length);
      console.log('options', options);
      defs.forEach(def => {
        options.splice(generateRandomNumber(config.MAX_INDEX - 1), 0, def);
      })
      return { a: defs, q: name, audioUrl, options };
    });
    const learntCards = generateData(selected);
    return {qa, learntCards, gameId};
  };

  module.exports = prepareGameData;