const {generateGameData} = require('../helpers');
const data = require('./generate-data');

describe('generateGameData', () => {
    data.forEach(datum => {
        it(`should handle ${datum.input} defsNumber`, () => {
        expect(generateGameData(datum.input)).toEqual(datum.output);
    })
    }) 
})