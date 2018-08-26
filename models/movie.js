var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var movieSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Full title must be provided']
    },
    genre: {
        type: String,
        required: [true, 'Genre has to be provided'],
    },
    cast: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    releasedate: {
        type: String,
        required: true
    },
    prodAddr: {
        type: String,
        required:true
    }
});

movieSchema.index({ prodAddr: 1, title: 1 });

var Movie = mongoose.model('Movies', movieSchema);
module.exports = Movie;
