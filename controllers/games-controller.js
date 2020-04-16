const {validationResult} = require('express-validator');
const Score = require('../models/score');
const User = require ('../models/user');
const HttpError = require('../models/http-error');
const {config: gameConfig} = require('./constants');

async function postScore (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors.errors);
        return next(new HttpError('invalid inputs passed, please check your data', 422));
    }
    const {gameResults, gameId, userId} = req.body;
    for (const item of gameResults) {
        // const {cardId, index} = result;
        let score;
        try {
            score = await Score.findOne({cardId: item.cardId});
            console.log('find score', score);
        } catch (err) {
            return next(new HttpError(`fetching score for card ${item.cardId} failed, please try again`, 500));
        }
        if (!score) {
            score = new Score({cardId: item.cardId, userId, score: {[gameId] : item.score}})
        } else {
            // TODO fix this
            const currentsScore = score.score[gameId];
            const scoreValue = Array.isArray(currentsScore) ? currentsScore[item.index] + item.result : item.result;
            const newScore = {...score.score, [gameId]: currentsScore + item.score}
            console.log('newScore', newScore);
            score.score = newScore;
        }
        try {
            console.log('score', score);
            await score.save();
            console.log('score after', score);
        } catch(err) {
            console.error(err);
            return next(new HttpError('updating score failed, please try again', 500));
        }
    }
    res.status(201).json({message: 'games results saved' });   
}

async function getGame(req, res, next) {
    const {gameId} = req.params;
    const userId = req.query.userid;
    let score;
    let result;
    try {
        score = await Score.find({userId}).populate('cardId');
        console.log('cardId', score.cardId);
    } catch(err) {
        return next(new HttpError('fetching gamecards failed, please try again', 500));
    }
    
    if(!score || !score.length) {
        result = {message: 'noting to learn'}
        return next();
    }

    const gameDataGanerator = require(`./game-data-generators/${gameId}`);

    const candidats = gameDataGanerator(score);

    res.json({candidats});
// const  { pickUnlearnt } = require('./game-data-generators/helpers');
// const {generateRandomSample} = require('./game-data-generators/helpers');

    // const unlearnt = pickUnlearnt({config: gameConfig, rawData: score, gameId});
    // const candidates = generateRandomSample({config: gameConfig, rawData: score, gameId});
    // res.json({unlearnt});
    // console.log(unlearnt);
    // res.json({count: score.length, score: score.map(item => item.toObject({getters: true}))});
}

exports.postScore = postScore;
exports.getGame = getGame;