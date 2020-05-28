const HttpError = require('../../models/http-error');
const WordCard = require('../../models/word-cards');

async function getCard(req, res, next) {
    const {cardId} = req.params;

    // check if this card exists
    let card;
    try {
        card = await WordCard.findById(cardId);
    } catch (err) {
        if(process.env.mode === 'dev') {
            console.error(err);
        }
        next(new HttpError('card search failed, please try again', 500));
    }
    if(!card) {
        return next(new HttpError(`could not find card with id ${cardId}`, 404));
    }
    res.json({...card.toObject({getters: true})})
}

module.exports = getCard;