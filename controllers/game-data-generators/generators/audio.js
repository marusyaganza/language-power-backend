const { config } = require('../../constants');
const  { pickUnlearnt, generateData } = require('../helpers');

const prepareGameData = rawData => {
    const gameId = 'audio';
    
    const withAudio = rawData.filter(
      i => i.card.pronunciation.length && i.card.pronunciation[0].audioUrl
    );

    const selected = pickUnlearnt({ rawData: withAudio, config, gameId});
    
    const qa = selected.map(card => {
    return { a: card.name, q: card.audioUrl };
  });
  const learntCards = generateData(selected);
  return {qa, learntCards, gameId};
};

module.exports = prepareGameData;