const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
    },
    email:{
        type: String,
    },
    role:{
        type: String,
        required: true,
        default:"user"
    },
    wallet:{
        type:Array,
        required: false
    }

},{
    collection: 'user',
    timestamps: true
});
module.exports = mongoose.model('user', User);