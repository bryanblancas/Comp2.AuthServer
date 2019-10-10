const {Router} = require('express');
const router = Router();
const path = require('path');
var crypto = require('crypto');

var fs = require('fs');

function verificarCertificado(usuario, res) {
    var pathUsuario = path.join(__dirname,'../../Usuarios_CRT/'+usuario);
    if (fs.existsSync(pathUsuario)){
        fs.readFile(pathUsuario+'/'+usuario+'.crt', {encoding: 'utf-8'}, async function(err,crt){
            if (!err) {
                crtSinEspacios = crt.split("\n").join("");
                crtSinEscape = crtSinEspacios.split("\r").join("");
                crtSinEncabezados = crtSinEscape.split('-----BEGIN CERTIFICATE-----')[1];
                crtSinEncabezados = crtSinEncabezados.split('-----END CERTIFICATE-----')[0]; 
                cert = crypto.createHash('sha256').update(crtSinEncabezados).digest('hex').toLowerCase();
                res.send(cert);
            }else{
                res.send('0');
            }
        });
    }else{
        res.send('0');
    }
}

router.post('/', async (req, res) => {
    const {usuario} = req.body;
    if(usuario){
        usuarioLower = usuario.toLowerCase();
        verificarCertificado(usuarioLower, res);
    }else{
        res.send('0');
    }
});

module.exports = router;