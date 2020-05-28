const {data} = require('./data');
const prepareGameData = require('../generator');


describe('generator helpers', () => {
    it('should generate gamedata', () => {
        data.forEach(datum => {
            const result = prepareGameData(datum.score, datum.config);
            expect(result.qa).toHaveLength(6);
            expect(result.learntCards).toHaveLength(6);          
        })
    });
it('should handle lack of cards', () => {
    data.forEach(datum => {
        const result = prepareGameData([], datum.config);
    expect(result).toEqual({qa:[], message: `You need to have at least ${datum.config.MIN_WORDS_IN_VOCAB} words to play this game`});      
    })
});
})