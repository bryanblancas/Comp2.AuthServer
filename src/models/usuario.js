const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    certificado: String
});

module.exports = mongoose.model('users',userSchema);