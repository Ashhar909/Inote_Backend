const mongoose  = require('mongoose');


const NotesSchema = new mongoose.Schema({
    user: {
        // * to link the user model eith the notes use same id for a user there and here
        type: mongoose.Schema.Types.ObjectId,   
        // * give the reference of teh model from where getting the id
        ref: "user"
    },
    title : {
        type:String,
        required: true
    },
    description : {
        type:String,
        required: true,
    },
    tag:{
        type:String,
        default: "general"
    },
    date : {
        type:Date,
        default: Date.now
    }
}) ;

const Note = mongoose.model('note',NotesSchema);

module.exports = Note