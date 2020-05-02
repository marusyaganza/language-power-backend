const {gameIds} = require('./constants');

const combineArr = (arr = []) => {
    const result = [];
    arr.forEach(elem => {
      result.push(...elem);
    });
    return result;
  };
  
  const filterString = string => string.replace(/[:\d]/g, '');
  
  function filterFullDef(defs = []) {
    const examples = [];
    let definition = '';
    const organizeDefs = def => {
      const [type, dt] = def;
      if (type === 'text') {
        definition = dt;
      }
      if (type === 'vis') {
        examples.push(...dt.map(i => i.t));
      }
      if (type === 'uns') {
        const uns = filterFullDef(combineArr(dt));
        examples.push(...uns.examples);
      }
    };
    defs.forEach(organizeDefs);
    return { examples, definition };
  }
  
  const getMetaData = data => {
    if (!data) return null;
    const { id, uuid, stems } = data;
    const shortDef = data['app-shortdef'];
    if (!shortDef) return null;
    const name = filterString(id);
    const defs = shortDef.def.filter(def => def.includes('{bc}'));
    if (! defs.length) return null;
    const particle = shortDef.fl;
    return { uuid, name, stems, defs, particle };
  };
  
  const getAudio = hwi => {
    const { prs, altprs } = hwi;
    const pr = prs || altprs;
    if (!pr) return [];
    const result = {};
    return pr.map(item => {
      result.transcription = item.ipa;
      if (item.sound) {
        const { audio } = item.sound;
        const letter = audio.slice(0, 1);
        result.audioUrl = `${process.env.AUDIO_ENDPOINT}/${letter}/${audio}.wav`;
      }
      return result;
    });
  };
  
  const getFullDef = def => {
    if (!def) return [];
    const arr = combineArr(def[0].sseq)
      .filter(i => i[0] === 'sense')
      .map(i => i[1].dt);
    const rawDefs = combineArr(arr);
    return filterFullDef(rawDefs);
  };
  
  const filterSearchResult = (result = [], criteria) => {
      return result.filter(item => item.name.includes(criteria));
    };

    const formatData = (initialData, query) => {
        const result = {
            suggestions: [],
            match: [],
            related: []
        }
    if (initialData.some(i => typeof i === 'string') && initialData.length) {
      result.suggestions = initialData;
      return result;
    }
    let formatted = initialData.map(({ meta, hwi, def }) => {
      const metaData = getMetaData(meta);
      if (!metaData) return null;
      const fullDef = getFullDef(def);
      const pronunciation = getAudio(hwi);
      return {
        ...metaData,
        fullDef,
        pronunciation
      };
    });
    formatted = formatted.filter(i => i);
    result.match = filterSearchResult(formatted, query);
    result.related = formatted.filter(item => !item.name.includes(query));
    return result;
  };

  function generateGameData (defsNumber) {
    const ids = Object.values(gameIds);
    const gameData = {};
    ids.forEach(id => {
      gameData[id] = id.includes('audio') ? [0] : new Array(defsNumber).fill(0)
    })
    return gameData;
  }
  

exports.formatData = formatData;
exports.generateGameData = generateGameData;