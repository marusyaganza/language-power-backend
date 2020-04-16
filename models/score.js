const  {Schema, model, Types} = require('mongoose');

const scoreSchema = new Schema({
    cardId: {type: Types.ObjectId, required: true, ref: 'WordCard'},
    userId: {type: Types.ObjectId, required: true, ref: 'User'},
    score: {type: Object, required: true}
});

module.exports = model('Score', scoreSchema)