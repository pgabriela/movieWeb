var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var moviesSavedSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Full title must be provided']
    },
    prodAddr: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true,
    },
    releasedate: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: [true, 'Genre has to be provided'],
    },
    cast: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
});

moviesSavedSchema.index({ prodAddr: 1, title: 1 });

var MoviesSaved = mongoose.model('MoviesSaved', moviesSavedSchema);
module.exports = MoviesSaved;
