const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const WordCard = require('../models/word-cards');
const User = require('../models/user');
const Score = require('../models/score');
const {formatData, generateGameData} = require('./helpers');
const axios = require('axios');
const {KEY, SEARC_ENDPOINT} = require('../api-data');

async function getUsersCards(req,res,next) {
    const {userId} = req.params;

    // check if inputs are valid
    let userCards;
    try {
        userCards = await WordCard.find({user: userId});
    } catch(err) {
        console.error(err);
        next(new HttpError('card search failed, please try again', 500));
    }
    if(!userCards) {
        return next(new HttpError(`a user with id ${userId} can not be found`, 404));
    }
    res.json([...userCards.map( card => card.toObject({getters: true}))]);
};

async function getCard(req, res, next) {
    const {cardId} = req.params;

    // check if this card exists
    let card;
    try {
        card = await WordCard.findById(cardId);
    } catch (err) {
        console.error(err);
        next(new HttpError('card search failed, please try again', 500));
    }
    if(!card) {
        return next(new HttpError(`could not find card with id ${cardId}`, 404));
    }
    res.json({...card.toObject({getters: true})})
}

async function addCard(req, res, next) {
    const {userId} = req.params;
    const card = req.body;

    // check if inputs are valid
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors.errors);
        return next(new HttpError('invalid inputs passed, please check your data', 422));
    }

    // check if this card exists
    let existingCard;
    try {
        existingCard = await WordCard.findOne({uuid: card.uuid, user: userId})
    } catch (err) {
        console.error(err);
    next(new HttpError('fetching card failed, please try again', 500));
    }
    if(existingCard) {
        return next(new HttpError(`card with name ${card.name} has been already added`), 422)
    }

    // fetch user
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        console.error(err);
        next(new HttpError('fetching user failed, please try again', 500));
    }

    if(!user) {
        return next(new HttpError(`could not find user with id ${userId}`, 404));
    }

    const gameData = generateGameData(card.defs.length);

    // save card
    const createdCard = new WordCard({...card, user: userId });
    const score = new Score({user: userId, score: gameData, card: null});
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        createdCard.score = score;
        await createdCard.save({session: sess});
        user.wordCards.push(createdCard);
        await user.save({session: sess});
        score.card = createdCard;
        await score.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        return next(new HttpError('creating card failed, please try again', 500));
    }
    res.status(201).json({messsage: 'card created'});
}

async function deleteCard(req, res, next) {
    const {cardId} = req.params;
    const errors = validationResult(req);

    // check if inputs are valid
    if(!errors.isEmpty()) {
        console.error(errors.errors);
        return next(new HttpError('invalid inputs passed, please check your data', 422));
    }

    // check if this card exists
    let card;
    try {
        card = await WordCard.findById(cardId).populate('user').populate('score');

    } catch (err) {
        console.error(err);
        next(new HttpError('fetching card failed, please try again', 500));
    }

    if(!card) {
        return next(new HttpError(`could not find card with id ${cardId}`, 404));
    }
    let score;
    try {
        Score.find({card: cardId});
    } catch {

    }

    // save card
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await card.remove({session: sess});
        await card.user.wordCards.pull(card);
        await card.score.remove({session: sess});
        await card.user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        console.error(err);
        next(new HttpError('deleting card failed, please try again', 500));
    }
    res.status(202).json({message: 'card removed'});
}

async function search (req, res, next){
    const {query} = req.params;
    const url = `${SEARC_ENDPOINT}/${query}?key=${KEY}`;
    let formattedRes;
    try {
       const response = await axios.get(url);
    formattedRes = formatData(response.data, query);  
    } catch (err) {
        console.error(err);
        next(new HttpError('word search failed', 500));
    }
    res.json({...formattedRes})
   
};

exports.getUsersCards = getUsersCards;
exports.addCard = addCard;
exports.deleteCard = deleteCard;
exports.getCard = getCard;
exports.search = search;