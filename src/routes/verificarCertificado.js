const {Router} = require('express');
const router = Router();
const path = require('path');
var crypto = require('crypto');

const User = require('../models/usuario')

var fs = require('fs');

function verificarCertificado(usuario, certificado, res) {
    //Verificamos el archivo con el certificado del usuario
    //var hash = crypto.createHash('sha256').update(nuevoUsuario.email).digest('hex');
    var pathUsuario = path.join(__dirname,'../../Usuarios_CRT/'+usuario);
    if (fs.existsSync(pathUsuario)){
        fs.readFile(pathUsuario+'/'+usuario+'.crt', {encoding: 'utf-8'}, async function(err,crt){
            if (!err) {
                crtSinEspacios = crt.split("\n").join("");
                cert = crypto.createHash('sha256').update(crtSinEspacios).digest('hex');
                /*console.log('Usuario: '+usuario);
                console.log('CertificadoServidor: '+ cert);
                console.log('CertificadoCliente : '+ certificado);*/
                if(cert === certificado){
                    //Existe usuario 
                    res.json({status: 1});
                }else{
                    res.json({status:0});    
                }
            }else{
                // No existe usuario
                res.json({status:0});
            }
        });
    }else{
        // No existe usuario
        res.json({status:0});
    }
}

router.post('/', async (req, res) => {
    // Recibe hash de usuario y hash de certificado (Hash 256)
    const {usuario, certificado} = req.body;
    if(usuario && certificado){
        verificarCertificado(usuario, certificado, res);
    }else{
        res.json({status:0});
    }
});

module.exports = router;