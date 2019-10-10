const {Router} = require('express');
const router = Router();
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

module.exports = router;