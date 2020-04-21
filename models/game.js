const {model, Schema} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const gameSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    name: {type: String, required: true, unique: true},
    logo: {type: String},
    config: {type: Object, required: true}
});

gameSchema.plugin(uniqueValidator);

module.exports = model('Game', gameSchema);