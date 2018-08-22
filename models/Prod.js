var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var prodSchema = new Schema({

    ethaddr: {
        type: String,
        required: [true, 'Ethereum Address must be provided']
    },
});

prodSchema.index({
    ethaddr: 1
});

var Prod = mongoose.model('Producers', prodSchema);
module.exports = Prod;
