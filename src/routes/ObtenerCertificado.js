
const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();
const path = require('path');
var crypto = require('crypto');
var fs = require('fs');

const node_openssl = require('node-openssl-cert');
const opensslCert = new node_openssl();
const openssl = require('openssl-nodejs');

/*function prueba() {
    direccion = 'src/Certificados/';
    openssl(['x509', '-noout', '-modulus', '-in', 'certificado_Servidor.crt'], direccion,function (err, buffer) {
        console.log(err.toString(), buffer.toString());
    });
}*/

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        if(existe.length > 0){    
            var hash = crypto.createHash('sha256').update(email).digest('hex');
            var pathUsuario = path.join(__dirname,'../../Usuarios_CRT/'+hash);
            if (fs.existsSync(pathUsuario)){
                fs.readFile(pathUsuario+'/'+hash+'.crt', {encoding: 'utf-8'}, function(err,crt){
                    if (!err) {
                        res.json({status: 1, certificado: crt});    
                    } else {
                        res.json({status: 0, email: email});
                    }
                });
            }else{
                res.json({status: 0, email: email});
            }
        }else{
            res.json({status: 0, email: email});
        }
    }
});


module.exports = router;