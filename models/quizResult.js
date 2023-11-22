const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    result: {
        type: 'string',
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('quizResult',resultSchema);