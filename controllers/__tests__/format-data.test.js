const {formatData} = require('../helpers');
const data = require('./format-data');

describe('formatData', () => {
    data.forEach(datum => {
        process.env.AUDIO_ENDPOINT = "https://test.com/audio";
        const {input, output} = datum;
        it(`should work with ${input.name} data`, () => {
        expect(formatData(input.array, input.query)).toEqual(output);
    }) 
})
})