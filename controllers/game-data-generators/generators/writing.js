const { config } = require('../../constants');
const  { pickUnlearnt, generateData } = require('../helpers');

const prepareGameData = rawData => {
    const gameId = 'writing';
    const selected = pickUnlearnt({ rawData, config, gameId });
  
    const qa = selected.map(card => {
      const {name, defs, audioUrl, index} = card;
      return { a: name, q: defs[index], audioUrl };
    });
  const learntCards = generateData(selected);
    return {qa, learntCards, gameId};
  };

module.exports = prepareGameData;
