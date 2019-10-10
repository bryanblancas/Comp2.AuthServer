const mongoose = require('mongoose');
const {mongodb} = require('./keys');


mongoose.connect(mongodb.URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(db => console.log('Database is connected AutoridadCertificadora_Usuarios'))
    .catch(err => console.log(err));