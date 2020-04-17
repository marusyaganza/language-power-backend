const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wordCardSchema = new Schema(
    {
        uuid: {type: String, required: true},
        name:{type: String, required: true},
        particle: {type: String, required: true},
        defs : {type: Array},
        stems: {type: Array},
        pronunciation: [
            {
                transcription:  {type: String},
                audioUrl: {type: String}
            }
        ],
        fullDef: {
            examples: {type: Array},
            definition: {type: String}
        },
        user: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
        score: {type: mongoose.Types.ObjectId, ref: 'Score'}
            } 
);

module.exports = mongoose.model('WordCard', wordCardSchema);