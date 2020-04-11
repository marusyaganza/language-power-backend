const {Schema, model, Types} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    wordCards: [{type: Types.ObjectId, required: true, ref: 'User'}]
});

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema)