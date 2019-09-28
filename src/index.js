const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const https = require('https');
const path = require('path');

//Settings
//app.set('port', process.env.PORT || 3000);
//app.set('json spaces', 2);
var options = {
    key: fs.readFileSync('src/Certificados/llavePrivada_Servidor.key'),
    cert: fs.readFileSync('src/Certificados/certificado_Servidor.crt'),
    ca: fs.readFileSync('src/Certificados/request_Servidor.csr')
}

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Initializations
require('./database');

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

//Routes
app.use('/api/Aviso',require('./routes/Aviso'));
//app.use('/api/obtenerCertificado',require('./routes/obtenerCertificado'));
app.use('/api/ObtenerCertificadoUsuario',require('./routes/ObtenerCertificadoUsuario'));
app.use('/api/revocarCertificado',require('./routes/revocarCertificado'));
app.use('/api/existeUsuario',require('./routes/existeUsuario'));
app.use('/api/guardarUsuario',require('./routes/guardarUsuario'));
//app.use('/api/Certificado',require('./routes/Certificado'));


//Starting the Server
/*app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});*/

https.createServer(options, app).listen(3000);