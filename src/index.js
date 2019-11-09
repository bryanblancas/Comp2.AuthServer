const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const https = require('https');
const path = require('path');

// Configuraciones de certificado
app.set('port', process.env.PORT || 3001);
var options = {
    key: fs.readFileSync('src/Certificados/llavePrivada_Servidor.key'),
    cert: fs.readFileSync('src/Certificados/certificado_Servidor.crt'),
    ca: fs.readFileSync('src/Certificados/request_Servidor.csr')
}

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Initializations
require('./database');

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

// Routes
app.use('/api/Aviso',require('./routes/Aviso'));
app.use('/api/ObtenerCertificado',require('./routes/ObtenerCertificado'));
app.use('/api/revocarCertificado',require('./routes/revocarCertificado'));
app.use('/api/guardarUsuario',require('./routes/guardarUsuario'));
app.use('/api/verificarCertificado',require('./routes/verificarCertificado'));

// Iniciando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});

https.createServer(options, app).listen(3000);