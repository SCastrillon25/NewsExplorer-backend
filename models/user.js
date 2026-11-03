const mongoose = require('mongoose');
const validator= require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'correo invalido',
        },

    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
});

module.exports = mongoose.model('user', userSchema);