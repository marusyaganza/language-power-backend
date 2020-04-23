const {validationResult} = require('express-validator');
const Score = require('../models/score');
const Game = require('../models/game');
const HttpError = require('../models/http-error');
const prepageGameData = require('./game-data-generator/generator');

async function postScore (req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors.errors);
        return next(new HttpError('invalid inputs passed, please check your data', 422));
    }
    const {gameResults, gameId} = req.body;

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
        const {userData} = req;
        if (score.user.toString() !== userData.userId) {
        return next(new HttpError('Auth is required for this operation', 403));
            }
        const currentScore = [...score.score[gameId]];
        const value = currentScore[index] + result;
        currentScore.splice(index, 1, value);
        const newScore = {...score.score, [gameId]: currentScore};
        score.score = {...newScore};
        score.lastTimePlayed = Date.now();
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

    const {userId} = req.userData;
    let score;

    try {
        score = await Score.find({user: userId}).populate('card');
    } catch(err) {
        return next(new HttpError('fetching gamecards failed, please try again', 500));
    }

    if (! score) {
        return next(new HttpError(`a user with id ${userId} can not be found`, 404));
    }

    let gameConfig;
    
    try {
        gameConfig = await Game.find({name: gameId});
    } catch (err) {
        console.error(err);
        return next(new HttpError('fetching game config failed, please try again', 500));
    }

    if (! gameConfig || !gameConfig.length === 1) {
        return next(new HttpError(`a game with id ${gameId} can not be found`, 404));
    }

    const cardsForGame = score.filter(i => i.score[gameId]);
    const {config} = gameConfig[0];
    const result = prepageGameData(cardsForGame, {...config, gameId});

    res.json({...result});
}

async function getAvailableGames (req, res, next) {
    let games;
    try {
        games = await Game.find();
    } catch (err) {
        console.error(err);
        return next(new HttpError('fetching games failed, please try again', 500));
    }
    if(!games) {
        res.json({message: 'no games available'});
    }
    res.json([...games.map(game => {const {name, title, description, logo, id, config} = game; return {name, title, description, logo, id, config}})])
}

async function addGame (req, res, next){
    const {game} = req.body;
    const createdGame = new Game({...game});
    try {
        createdGame.save();
    } catch (err) {
        console.error(err);
        return next(new HttpError('creating game failed, please try again', 500));
    }
    res.json({game: createdGame.toObject({getters: true})})
}

exports.postScore = postScore;
exports.getGame = getGame;
exports.getAvailableGames = getAvailableGames;
exports.addGame = addGame;