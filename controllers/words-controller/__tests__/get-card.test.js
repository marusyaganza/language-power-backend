
const WordCard = require('../../../models/word-cards');

const getCard = require('../get-card');
const HttpError = require('../../../models/http-error');


jest.mock('../../../models/word-cards');

const next = jest.fn();
const json = jest.fn();
const req = {params: {cardId: '0'}};

describe('getCard should return user cards', () => {
    afterEach(() => {
        jest.restoreAllMocks();
      })
    it('should return card', async () => {
        WordCard.findById.mockResolvedValue({id: '0', toObject: jest.fn()});
            await getCard(req, {json}, next);
            expect(json).toHaveBeenCalledWith({});
    });
    it('should handle server error', async () => {
    WordCard.findById.mockImplementation(() => {throw new Error('dummy error')});
        await getCard(req, {json}, next);
        expect(next).toHaveBeenCalledWith(new HttpError('card search failed, please try again', 500));
    });
    it('should handle null user cards', async () => {
        WordCard.findById.mockResolvedValue(null);
            await getCard(req, {json}, next);
            expect(next).toHaveBeenCalledWith(new HttpError('could not find card with id 0', 404));
        })  
})

