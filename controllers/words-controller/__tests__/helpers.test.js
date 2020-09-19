const {createAudioUrl} =  require('../../helpers_collegiate');

const audios = [
    {in: 'bixapple2', out: 'https://audio.com/bix/bixapple2.wav'},
    {in: 'ggapple2', out: 'https://audio.com/gg/ggapple2.wav'},
    {in: 'apple2', out: 'https://audio.com/a/apple2.wav'},
    {in: '78882', out: 'https://audio.com/number/78882.wav'},
    {in: '*78882', out: 'https://audio.com/number/*78882.wav'},
    {in: '_78882', out: 'https://audio.com/number/_78882.wav'},
]

process.env.AUDIO_ENDPOINT = 'https://audio.com';

describe('helpers ', () => {
    // afterEach(() => {
    //   jest.restoreAllMocks();
    // });
    it('createAudioUrl generates right urls', () => {
        audios.forEach(audio => {
            expect(createAudioUrl(audio.in)).toBe(audio.out);
        }           
        )
    });
});