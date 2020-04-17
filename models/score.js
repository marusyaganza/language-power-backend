const  {Schema, model, Types} = require('mongoose');

const scoreSchema = new Schema({
    card: {type: Types.ObjectId, required: true, ref: 'WordCard'},
    user: {type: Types.ObjectId, required: true, ref: 'User'},
    score: {type: Object, required: true},
    lastTimePlayed: {type: Date}
});

module.exports = model('Score', scoreSchema)