var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var adminSchema = new Schema({

    username: {
        type: String,
        required: [true, 'Full name must be provided']
    },

    password: {
        type: String,
        required: [true, 'Password cannot be left blank']
    },
});
adminSchema.index({
    username: 1
});

//authenticate input against database
adminSchema.statics.authenticate = function(username, password, callback) {
    Admin.findOne({
            username: username
        })
        .exec(function(err, admin) {
            if (err) {
                return callback(err)
            } else if (!admin) {
                var err = new Error('Admin account not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, admin.password, function(err, result) {
                if (result === true) {
                    return callback(null, admin);
                } else {
                    return callback();
                }
            })
        });
}

//hashing a password before saving it to the database
adminSchema.pre('save', function(next) {
    var admin = this;
    bcrypt.hash(admin.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        admin.password = hash;
        admin.username = admin.username.toLowerCase();
        next();
    })
});

var Admin = mongoose.model('Admins', adminSchema);
module.exports = Admin;
