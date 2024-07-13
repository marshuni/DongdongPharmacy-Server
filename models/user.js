const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const cartItemSchema = new Schema({
    medicine_id: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true }
});

const addressSchema = new Schema({
    location: { type: String, required: true },
    recipient: { type: String, required: true },
    contact: { type: String, required: true }
});

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    cart: [cartItemSchema],
    address: [addressSchema]
});

userSchema.pre('save', function (next) {
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

module.exports = mongoose.model("User", userSchema);