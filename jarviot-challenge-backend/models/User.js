const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: [true, 'User Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    token: {
        type: String,
        required: [true, 'Token is required'],
        unique: true,
    },
});

UserSchema.methods.getSignedJWTToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};

module.exports = mongoose.model('User', UserSchema);
