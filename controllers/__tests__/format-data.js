const shoal = require('./mocks/shoal.json');
const doll = require('./mocks/doll.json');
const noMeta = require('./mocks/no-meta-data.json');
const noAudio = require('./mocks/no-audio.json');
const noDeffs = require('./mocks/no-deff.json');

const data = [
  {
    input: {
      name: 'empty',
      array: [],
      query: '',
    },
    output: {
      suggestions: [],
      match: [],
      related: [],
    },
  },
  {
    input: {
      name: 'homonym',
      array: shoal,
      query: 'shoal',
    },
    output: {
      suggestions: [],
      match: [
        {
          uuid: '74046e79-e4c9-4b52-ac96-cb7ae98fb601',
          name: 'shoal',
          stems: ['shoal', 'shoals'],
          defs: [
            '{bc} a large group or number',
            '{bc} an area where the water in a sea, lake, or river is not deep',
            '{bc} a small, raised area of sand just below the surface of the water',
          ],
          particle: 'noun',
          examples: [
            'fish lurking in the {it}shoals{/it}',
            'The boat ran aground on the {it}shoal{/it}.',
            'a {it}shoal{/it} [=(more commonly) {it}school{/it}] {it}of{/it} fish',
            '({it}chiefly Brit{/it}) a {it}shoal of{/it} letters from angry readers',
          ],
          pronunciation: {
            transcription: 'ˈʃoʊl',
            audioUrl: 'https://test.com/audio/s/shoal001.wav',
          },
        },
      ],
      related: [],
    },
  },
  {
    input: {
      name: 'upper case query',
      array: shoal,
      query: 'Shoal',
    },
    output: {
      suggestions: [],
      match: [
        {
          uuid: '74046e79-e4c9-4b52-ac96-cb7ae98fb601',
          name: 'shoal',
          stems: ['shoal', 'shoals'],
          defs: [
            '{bc} a large group or number',
            '{bc} an area where the water in a sea, lake, or river is not deep',
            '{bc} a small, raised area of sand just below the surface of the water',
          ],
          particle: 'noun',
          examples: [
            'fish lurking in the {it}shoals{/it}',
            'The boat ran aground on the {it}shoal{/it}.',
            'a {it}shoal{/it} [=(more commonly) {it}school{/it}] {it}of{/it} fish',
            '({it}chiefly Brit{/it}) a {it}shoal of{/it} letters from angry readers',
          ],
          pronunciation: {
            transcription: 'ˈʃoʊl',
            audioUrl: 'https://test.com/audio/s/shoal001.wav',
          },
        },
      ],
      related: [],
    },
  },
  {
    input: {
      name: 'suggestions',
      array: ['court', 'cor'],
      query: 'cot',
    },
    output: {
      suggestions: ['court', 'cor'],
      match: [],
      related: [],
    },
  },
  {
    input: {
      name: 'empty defs',
      array: doll,
      query: 'doll',
    },
    output: {
      suggestions: [],
      match: [],
      related: [],
    },
  },
  {
    input: {
      name: 'empty metadata',
      array: noMeta,
      query: 'doll',
    },
    output: {
      suggestions: [],
      match: [],
      related: [],
    },
  },
  {
    input: {
      name: 'empty audio',
      array: noAudio,
      query: 'demure',
    },
    output: {
      suggestions: [],
      match: [
        {
          uuid: '43afd541-00c2-442f-a855-485c2d3be1af',
          name: 'demure',
          stems: ['demure', 'demurely', 'demureness'],
          defs: [
            '{bc} quiet and polite',
            '{bc} not attracting or demanding a lot of attention {bc} not showy or flashy',
          ],
          particle: 'adjective',
          examples: [],
          pronunciation: {},
        },
      ],
      related: [],
    },
  },
  {
    input: {
      name: 'no defs',
      array: noDeffs,
      query: 'demure',
    },
    output: {
      suggestions: [],
      match: [],
      related: [],
    },
  },
];
module.exports = data;
