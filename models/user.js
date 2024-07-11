const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var ObjectId = mongoose.Schema.ObjectId
const userSchema = new mongoose.Schema({
    userid : ObjectId,
    username: { type:String, unique:true },
    password: String
});

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("User",userSchema);