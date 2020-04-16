const { config } = require('../constants');
const  { pickUnlearnt } = require('./helpers');

const prepareGameData = rawData => {
    const gameId = 'audio';
    
    const withAudio = rawData.filter(
      i => i.cardId.pronunciation.length && i.cardId.pronunciation[0].audioUrl
    );

    const selected = pickUnlearnt({ rawData: withAudio, config, gameId});
    
  const qa = selected.map(card => {
    // const { pronunciation } = data.cardId;
    // const audioUrl = pronunciation.length ? pronunciation[0].audioUrl : null;
    return { a: card.name, q: card.audioUrl };
  });
  const learntCards = selected.map(item => {const {cardId, index} = item; return {cardId, index}});
  return {qa, learntCards, gameId};
};

module.exports = prepareGameData;