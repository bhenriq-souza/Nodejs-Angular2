var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('../models/user');

var schema = new Schema({
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

// Say to mongoose trigger this after some kind of change happens.
schema.post('remove', (message) => {
    User.findById(message.user, (err, user) =>{
        user.messages.pull(message);
        user.save();
    });
});

module.exports = mongoose.model('Message', schema);
