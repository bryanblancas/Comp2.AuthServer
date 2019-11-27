
const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();
var crypto = require('crypto');

const {IP} = require('./IpClass');

var FTPClient = require('ftp');

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: crypto.createHash('sha256').update(password).digest('hex')});
        if(existe.length > 0){ 
            var hash = crypto.createHash('sha256').update(email).digest('hex');
            var pathUsuario = '/Usuarios_CRT/'+hash;

            var c = new FTPClient();
            
            c.connect({
                host: IP.dir,
                user: "diegoarturomg",
                password: "211096"
            });

            var content = '';

            var ruta = pathUsuario+'/'+hash+'.crt';
    
            c.on('ready', function() {
                c.get(ruta, function(err, stream) {
                    stream.on('data', function(chunk) {
                        content += chunk.toString();
                    });
                    stream.on('end', function() {
                        if (content != null) {
                            res.json({status: 1, certificado: content});
                        } else {
                            res.json({status: 0, email: email});
                        }
                    });
                })
            });
            
        }else{
            res.json({status: 0, email: email});
        }
    }
});


module.exports = router;