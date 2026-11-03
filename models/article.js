const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        trim: true,        
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        default: "",
    },

    published_at: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    source: {
        type: String,
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

    url: {
        type: String,
    }
}, 
    {
        timestamps: true,
    }
);

articleSchema.index(
    { owner: 1, url: 1 },
    { unique: true }
);

module.exports = mongoose.model('article', articleSchema);