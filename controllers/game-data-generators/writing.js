const { config } = require('../constants');
const  { pickUnlearnt } = require('./helpers');

const prepareGameData = rawData => {
    const gameId = 'writing';
    const selected = pickUnlearnt({ rawData, config, gameId });
  
    const qa = selected.map(card => {
      const {name, defs, audioUrl, index} = card;
        // const card = item.cardId;
        // const index = item.score[gameId].findIndex(i => i < config.MAX_GAMES);
      // const { pronunciation } = card;
      // const audioUrl = pronunciation.length ? pronunciation[0].audioUrl : null;
      return { a: name, q: defs[index], audioUrl };
    });
  const learntCards = selected.map(card => {const {cardId, index} = card; return {cardId, index}});

    return {qa, learntCards, gameId};
  };

module.exports = prepareGameData;
