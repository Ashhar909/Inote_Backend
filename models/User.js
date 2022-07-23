const mongoose  = require('mongoose');

// create the user fields and its types
const UserSchema = new mongoose.Schema({
    name : {
        type:String,
        required: true
    },
    email : {
        type:String,
        required: true,
        unique:true
    },
    password : {
        type:String,
        required: true
    },
    date : {
        type:Date,
        default: Date.now
    }
}) ;

const User = mongoose.model('user',UserSchema);

module.exports = User;