const { config } = require('../../constants');
const  { pickUnlearnt, generateRandomSample,  generateRandomNumber, generateData} = require('../helpers');

const generateOptions = (rawData, uuid) => {
  const selected = rawData.length === config.MIN_WORDS ? rawData 
    : generateRandomSample(rawData, config.MAX_INDEX + 1);
    const filtered = selected.filter(i => i.card.uuid !== uuid);
    return filtered
    .slice(0, config.MAX_INDEX)
    .map(i => {
      const {defs} = i.card;
      const index = generateRandomNumber(defs.length - 1);
      return defs[index];
    });
  };
  
const prepareGameData = rawData => {
    const gameId = 'audioChallenge';
    if(rawData.length < config.MIN_WORDS) {
      return {qa:[], message: `You need to have at least ${config.MIN_WORDS} words to play this game`}
    }
    const withAudio = rawData.filter(
      i => i.card.pronunciation.length && i.card.pronunciation[0].audioUrl
    );
    const selected = pickUnlearnt({ rawData: withAudio, config, gameId });
    const qa = selected.map(card => {
        const {audioUrl, uuid, name, index, defs} = card;
      const options = generateOptions(rawData, uuid);
      const position = generateRandomNumber(options.length + 1);
      options.splice(position, 0, defs[index]);
      return { a: defs[index], q: audioUrl, options , text: name};
    });
    const learntCards = generateData(selected);
    return {qa, learntCards, gameId};
  };

  module.exports = prepareGameData;