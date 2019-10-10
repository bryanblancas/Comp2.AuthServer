const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    path: String
});

module.exports = mongoose.model('users',userSchema);