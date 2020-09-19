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
    const name = filterString(id);
    return { uuid, name, stems };
  };
  
  // if audio begins with "bix", the subdirectory should be "bix",
  // if audio begins with "gg", the subdirectory should be "gg",
  // if audio begins with a number or punctuation (eg, "_"), the subdirectory should be "number",
  // otherwise, the subdirectory is equal to the first letter of audio.
  function createAudioUrl(audio) {
    let subdir = audio.slice(0, 1);
    const punctuationOrNumberRegexp = /\W|\d|[_]/;
    if(punctuationOrNumberRegexp.test(subdir)) {
      subdir = 'number';
    }
    const patterns = ['bix', 'gg']
    patterns.forEach(pattern => {if(audio.startsWith(pattern)) {
      subdir = pattern;
   }})
   console.log('audio', audio, subdir);
   return `${process.env.AUDIO_ENDPOINT}/${subdir}/${audio}.wav`
  }
  
  const getAudio = hwi => {
    const { prs, altprs } = hwi;
    const pr = prs || altprs;
    if (!pr || !pr.length) {
      return {};
    }
    const {sound, mw} = pr[0];
    let audioUrl = null;
    if (sound) {
          const { audio } = sound;
          audioUrl = createAudioUrl(audio);
        }
        return {audioUrl, transcription: mw}
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
                 pronunciation: prev.pronunciation.audioUrl? prev.pronunciation : cur.pronunciation,
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

    const formatData = (initialData=[], queryString='') => {
      const query = queryString.toLowerCase();
        const result = {
            suggestions: [],
            match: [],
            related: []
        }
    if (initialData.some(i => typeof i === 'string') && initialData.length) {
      result.suggestions = initialData;
      return result;
    }
    let formatted = initialData.map(({ meta, hwi, def, shortdef, fl }) => {
      const metaData = getMetaData(meta);
      const examples = getExamples(def);
      const pronunciation = getAudio(hwi);
      return {
        ...metaData,
        examples,
        pronunciation,
        defs: shortdef,
        particle: fl
      };
    });
    formatted = formatted.filter(i => i);
    formatted = mergeHomonyms(formatted);
    result.match = formatted;
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
exports.createAudioUrl = createAudioUrl;