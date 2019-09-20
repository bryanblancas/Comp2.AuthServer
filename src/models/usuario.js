const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    ciudad: String,
    estado: String,
    localidad: String,
    codigoPostal: String,
    direccion: String,
    organizacionNombre: String,
    organizacionAbreviado: String,
    dominio: String,
    crt: String,
    csr: String,
    privateKey: String
});

module.exports = mongoose.model('users',userSchema);