// const { config } = require('../../constants');
const  { pickUnlearnt, generateRandomSample,  generateRandomNumber, generateData} = require('./helpers');

const generateOptions = ({rawData, uuid, optionsNum, config}) => {
  const {OPTIONS_NUM, ANSWER_PROP} = config;
  const selected = rawData.length === OPTIONS_NUM ? rawData 
  : generateRandomSample(rawData, optionsNum || OPTIONS_NUM);
    const filtered = selected.filter(i => i.card.uuid !== uuid);
    return filtered
    .slice(0, optionsNum)
    .map(i => {
      if (ANSWER_PROP === 'defs') {
        const {defs} = i.card;
      const index = generateRandomNumber(defs.length - 1);
      return defs[index];
      }
      return i.card[ANSWER_PROP];
    });
  };
  
const prepareGameData = (rawData, config) => {
  const {gameId, QUESTION_PROP, ANSWER_PROP, AUDIO_IS_REQUIRED, MIN_WORDS_IN_VOCAB, OPTIONS_NUM, MULTIPLE_CORRECT_ANSWERS} = config;
  if(rawData.length < MIN_WORDS_IN_VOCAB) {
    return {qa:[], message: `You need to have at least ${MIN_WORDS_IN_VOCAB} words to play this game`}
  }
  let words = rawData;
  if (AUDIO_IS_REQUIRED) {
    words = rawData.filter(
      i => i.card.pronunciation && i.card.pronunciation.audioUrl
      );
    }
    const selected = pickUnlearnt({ rawData: words, config, gameId });
    const qa = selected.map(card => {
        const {audioUrl, uuid, name, index, defs} = card;
        const result = {text: name}
        if (!AUDIO_IS_REQUIRED) {
          result.audioUrl = audioUrl;
        }
        result.q = QUESTION_PROP === 'defs' ? defs[index]
         : card[QUESTION_PROP];
         result.a = ANSWER_PROP === 'defs' ? defs[index]: card[ANSWER_PROP];  
        const optionsNum = MULTIPLE_CORRECT_ANSWERS ? OPTIONS_NUM - defs.length : OPTIONS_NUM;
        const options = generateOptions({rawData, uuid, optionsNum, config});

        if(OPTIONS_NUM) {
          if (MULTIPLE_CORRECT_ANSWERS) {
            defs.forEach(def => {
              const position = generateRandomNumber(OPTIONS_NUM -1)
              options.splice(position, 0, def);
            });
            const answerArr = defs.map(def => options.findIndex(i => i===def));
            result.a = answerArr.sort((a, b) => a-b).join('');
          } else {
            const position = generateRandomNumber(optionsNum);
            options.splice(position, 0, result.a);
            result.a = position.toString();
          }
          result.options = options;
        }
      return result;
    });
    const learntCards = generateData(selected);
    return {qa, learntCards, gameId: gameId};
  };

  module.exports = prepareGameData;