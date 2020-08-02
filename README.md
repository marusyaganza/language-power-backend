# language-power-backend

## Purpose

API server for https://github.com/marusyaganza/language-power.

## Technological stack

* Node.js
* Express
* Mongoose
* MongoDB
* Jest

## Routes

### User routes `/api/user/`
* POST `/signup` - sign up  a new user. Currently disabled for production environment.
* POST `/login` - login route.

### Words route `/api/user/`
* GET `/search/:query` - search _query_ in *Merriam-Webster's dictionary*

_authentification is  required_ for this routes:
* GET `/` - get all cards of current user
* POST `/addCard` - add new card
* DELETE `/:cardId` - delete card with id _cardId_

### Games routes `/games`
* GET `/catalog` get available games
* POST `/catalog` add  game to catalog

_authentification is  required_ for this routes:
* GET `/:gameId` get gamedata for _gameId_ game
* PATCH `/score` -  save game results

