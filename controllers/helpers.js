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
    const organizeDefs = def => {
      const [type, dt] = def;
      if (type === 'vis') {
        examples.push(...dt.map(i => i.t));
      }
      if (type === 'uns') {
        const uns = filterFullDef(combineArr(dt));
        examples.push(...uns);
      }
    };
    defs.forEach(organizeDefs);
    return examples;
  }
  
  const getMetaData = data => {
    if (!data) return null;
    const { id, uuid, stems } = data;
    const shortDef = data['app-shortdef'];
    if (!shortDef || !shortDef.def) return null;
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
  
  const getExamples = def => {
    if (!def) return [];
    const arr = combineArr(def[0].sseq)
      .filter(i => i[0] === 'sense')
      .map(i => i[1].dt);
    const rawDefs = combineArr(arr);
    return filterFullDef(rawDefs);
  };

  function mergeHomonyms(arr =[]) {
    const result = [];
    const uuids = [];
    arr.forEach(el => {
      if(uuids.includes(el.uuid)) {
        return;
      }
      const matches = arr.filter(
        item => item.name === el.name && el.particle === item.particle
        );
         if(matches.length) {
           uuids.push(...matches.map(i => i.uuid));
           const merged = matches.reduce(
             (prev, cur) => {
               return {
                 ...cur,
                 pronunciation: prev.pronunciation[0].audioUrl? prev.pronunciation : cur.pronunciation,
                 defs: [...cur.defs, ...prev.defs],
                 examples: [...prev.examples, ...cur.examples]}});
             result.push(merged);
         }
    });
    result.push(...arr.filter(el => !uuids.includes(el.uuid)));
    return result;
  }
  
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
      const examples = getExamples(def);
      const pronunciation = getAudio(hwi);
      return {
        ...metaData,
        examples,
        pronunciation
      };
    });
    formatted = formatted.filter(i => i);
    formatted = mergeHomonyms(formatted);
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