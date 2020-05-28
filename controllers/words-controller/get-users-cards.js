const HttpError = require('../../models/http-error');
const WordCard = require('../../models/word-cards');

async function getUsersCards(req,res,next) {
    const {userId} = req.userData;

    let userCards;
    try {
        userCards = await WordCard.find({user: userId});
    } catch(err) {
        // if(process.env.mode === 'dev') {
        //     console.error(err);
        // }
        return next(new HttpError('card search failed, please try again', 500));
    }
    if(!userCards) {
        return next(new HttpError(`a user with id ${userId} can not be found`, 404));
    }
    res.json([...userCards.map( card => card.toObject({getters: true}))]);
}

module.exports = getUsersCards;