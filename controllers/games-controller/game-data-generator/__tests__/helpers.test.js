const {generateRandomSample, generateRandomArray, pickUnlearnt} = require('../helpers');
const score = require('./mocks/score.json');
const games = require('./mocks/games.json');

describe('generator helpers', () => {
    it('should generateRandomArray', () => {
        const result = generateRandomArray(6, 3);
        result.forEach((num, i) => {
            expect(num).toBeLessThan(6);
            expect(result.findIndex((item, index) => item === num && index !==i)).toBe(-1)
        });
        expect(result).toHaveLength(3);
});
it('should generateRandomSample', () => {
    const result = generateRandomSample(score, 4);
    expect(result).toHaveLength(4);
});
it('should pickUnlearnt', () => {
    const result = pickUnlearnt({ rawData: score, gameId: games[0].name, config:  games[0].config});
    expect(result).toHaveLength(6);
});
})