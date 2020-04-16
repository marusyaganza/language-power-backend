const { config } = require('../constants');
const  { pickUnlearnt, generateRandomSample,  generateRandomNumber, generateData} = require('./helpers');

const generateOptions = (rawData, uuid) => {
    const selected = generateRandomSample(rawData, config.MAX_INDEX + 1);
    const filtered = selected.filter(i => i.cardId.uuid !== uuid);
    // console.log('filtered', filtered);
    return filtered
    .slice(0, config.MAX_INDEX)
    .map(i => {
      const {defs} = i.cardId;
      const index = generateRandomNumber(defs.length - 1);
      return defs[index];
    });
  };
  
const prepareGameData = rawData => {
    const gameId = 'definitionWord';
    const withAudio = rawData.filter(
      i => i.cardId.pronunciation.length && i.cardId.pronunciation[0].audioUrl
    );
    console.log('withAudio', withAudio);
    const selected = pickUnlearnt({ rawData: withAudio, config, gameId });
    const qa = selected.map(card => {
        const {audioUrl, uuid, name, index, defs} = card;
    //   const { pronunciation } = card;
    //   const audioUrl = pronunciation.length ? pronunciation[0].audioUrl : null;
      const options = generateOptions(rawData, uuid);
      const position = generateRandomNumber(options.length + 1);
      console.log('position', position);
      options.splice(position, 0, defs[index]);
      return { a: defs[index], q: audioUrl, options , text: name};
    });
    const learntCards = generateData(selected);
    return {qa, learntCards, gameId};
  };

  module.exports = prepareGameData;