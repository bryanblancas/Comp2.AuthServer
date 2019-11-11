const {Router} = require('express');
const router = Router();
var crypto = require('crypto');
var FTPClient = require('ftp');
const {IP} = require('./IpClass');

router.post('/', async (req, res) => {
    const {usuario} = req.body;
    if(usuario){
        //usuarioLower = usuario.toLowerCase();
        
        //var hash = crypto.createHash('sha256').update(usuarioLower).digest('hex');
        var pathUsuario = '/Usuarios_CRT/'+usuario;

        var c = new FTPClient();
        
        c.connect({
            host: IP.dir,
            user: "diegoarturomg",
            password: "211096"
        });

        var content = '';

        var ruta = pathUsuario+'/'+usuario+'.crt';
        //console.log(ruta);
        c.on('ready', function() {
            c.get(ruta, function(err, stream) {
                stream.on('data', function(chunk) {
                    content += chunk.toString();
                });
                stream.on('end', function() {
                    if (content != null) {
                        crtSinEspacios = content.split("\n").join("");
                        crtSinEscape = crtSinEspacios.split("\r").join("");
                        crtSinEncabezados = crtSinEscape.split('-----BEGIN CERTIFICATE-----')[1];
                        crtSinEncabezados = crtSinEncabezados.split('-----END CERTIFICATE-----')[0]; 
                        cert = crypto.createHash('sha256').update(crtSinEncabezados).digest('hex').toLowerCase();
                        res.send(cert);  
                    } else {
                        res.send('0');
                    }
                });
            })
        });
    }else{
        res.send('0');
    }
});

module.exports = router;