const {validationResult} = require('express-validator');
const Score = require('../models/score');
const HttpError = require('../models/http-error');
const {gameIds} = require('./constants');

async function postScore (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors.errors);
        return next(new HttpError('invalid inputs passed, please check your data', 422));
    }
    const {gameResults, gameId} = req.body;
    if (!gameIds[gameId]) {
        return next(new HttpError(`game ${gameId} is not found`, 404));
    }
    for (const item of gameResults) {
        let score;
        const {id, index, result} = item;
        try {
            score = await Score.findById(id);
        } catch (err) {
            return next(new HttpError(`fetching score for card ${item.cardId} failed, please try again`, 500));
        }
        if (!score) {
            return next(new HttpError(`score ${id} is not found`, 404));
        }
        const currentScore = [...score.score[gameId]];
        const value = currentScore[index] + result;
        currentScore.splice(index, 1, value);
        const newScore = {...score.score, [gameId]: currentScore};
        score.score = {...newScore};
        try {
            await score.save();
        } catch(err) {
            console.error(err);
            return next(new HttpError('updating score failed, please try again', 500));
        }
    }
    res.status(201).json({message: 'games results saved' });   
}

async function getGame(req, res, next) {
    const {gameId} = req.params;

    if (!gameIds[gameId]) {
        return next(new HttpError(`game ${gameId} is not found`, 404));
    }

    const userId = req.query.userid;
    let score;

    try {
        score = await Score.find({user: userId}).populate('card');
    } catch(err) {
        return next(new HttpError('fetching gamecards failed, please try again', 500));
    }
    
    if(!score || !score.length) {
        return res.json({message: 'noting to learn'});
    }

    const gameDataGanerator = require(`./game-data-generators/generators/${gameId}`);
    const cardsForGame = score.filter(i => i.score[gameId]);
    const result = gameDataGanerator(cardsForGame);

    res.json({...result});
}

exports.postScore = postScore;
exports.getGame = getGame;