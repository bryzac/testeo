const mongoose = require('mongoose');

const todolistSchema = new mongoose.Schema({
    text: String,
    checked: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

todolistSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Todolist = mongoose.model('Todolist', todolistSchema);

module.exports = Todolist;