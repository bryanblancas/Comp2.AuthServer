const {Router} = require('express');
const router = Router();
var fs = require('fs');
const path = require('path');
var request = require('request');

router.post('/obtenerDatos', async (req, res) => {
    const {codigoPostalReq} = req.body;
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    }
    var options = {
        url     : 'https://api-codigos-postales.herokuapp.com/v2/codigo_postal/',
        method  : 'GET',
        jar     : true,
        headers : headers
    }
    options.url += codigoPostalReq; 
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json({status:1, datos: JSON.parse(body)});
        }
    });
});

router.post('/obtenerCiudad', async (req, res) => {
    const {codigoPostalReq} = req.body;
    fs.readFile(path.join(__dirname,'CPdescarga.txt'), 'utf8', (err, data) => {
        if(err) {
            res.json({status: '0'});
        } else {
            var datos = data;
            var renglon = datos.split('\r\n');
            var resultado = [];
            for(var i=0;i<renglon.length;i++){
                var fila = renglon[i].split('|');
                var codigoPostal = fila[0];
                if(codigoPostal == codigoPostalReq){
                    if(!existe(resultado,fila[4])){
                        resultado.push(fila[4]);
                    }
                }
            }
            res.json({status:1, datos: resultado});
        }
    });
});

router.post('/obtenerEstado', async (req, res) => {
    const {codigoPostalReq, ciudadReq} = req.body;
    fs.readFile(path.join(__dirname,'CPdescarga.txt'), 'utf-8', (err, data) => {
        if(err) {
            res.json({status: '0'});
        } else {
            var datos = data;
            var renglon = datos.split('\r\n');
            var resultado = [];
            for(var i=0;i<renglon.length;i++){
                var fila = renglon[i].split('|');
                var codigoPostal = fila[0];
                var ciudad = fila[4];
                if(codigoPostal == codigoPostalReq && ciudad == ciudadReq){
                    if(!existe(resultado,fila[5])){
                        resultado.push(fila[5]);
                    }
                }
            }
            res.json({status:1, datos: resultado});
        }
    });
});

router.post('/obtenerDelegacion', async (req, res) => {
    const {codigoPostalReq, ciudadReq, estadoReq} = req.body;
    fs.readFile(path.join(__dirname,'CPdescarga.txt'), 'utf-8', (err, data) => {
        if(err) {
            res.json({status: '0'});
        } else {
            var datos = data;
            var renglon = datos.split('\r\n');
            var resultado = [];
            for(var i=0;i<renglon.length;i++){
                var fila = renglon[i].split('|');
                var codigoPostal = fila[0];
                var ciudad = fila[4];
                var estado = fila[5];
                if(codigoPostal == codigoPostalReq && ciudad == ciudadReq && estado == estadoReq){
                    if(!existe(resultado,fila[3])){
                        resultado.push(fila[3]);
                    }
                }
            }
            res.json({status:1, datos: resultado});
        }
    });
});

router.post('/obtenerLocalidad', async (req, res) => {
    const {codigoPostalReq, ciudadReq, estadoReq, delegacionReq} = req.body;
    fs.readFile(path.join(__dirname,'CPdescarga.txt'), 'utf-8', (err, data) => {
        if(err) {
            res.json({status: '0'});
        } else {
            var datos = data;
            var renglon = datos.split('\r\n');
            var resultado = [];
            for(var i=0;i<renglon.length;i++){
                var fila = renglon[i].split('|');
                var codigoPostal = fila[0];
                var ciudad = fila[4];
                var estado = fila[5];
                var delegacion = fila[3];
                if(codigoPostal == codigoPostalReq && ciudad == ciudadReq && estado == estadoReq && delegacion == delegacionReq){
                    if(!existe(resultado,fila[1])){
                        resultado.push([fila[1],fila[2]]);
                    }
                }
            }
            res.json({status:1, datos: resultado});
        }
    });
});

function existe(resultado, filaArreglo) {
    for(var i=0;i<resultado.length;i++){
        if(resultado[i] == filaArreglo){
            return true;
        }
    }
    return false;
}



module.exports = router;