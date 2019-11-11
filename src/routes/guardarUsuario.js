const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();
const path = require('path');
var crypto = require('crypto');

const {IP} = require('./IpClass');

const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();
var fs = require('fs');

var FTPClient = require('ftp');

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const nuevoUsuario = new User();
        nuevoUsuario.email = email;
        nuevoUsuario.password = crypto.createHash('sha256').update(password).digest('hex');
        var csroptions = {
            hash: 'sha256',
            days: 365,
            subject: {
                countryName: 'MX',
                stateOrProvinceName: 'CDMX',
                localityName: 'CDMX',
                postalCode: '01234',
                streetAddress: 'CDMX',
                organizationName: 'organization',
                organizationalUnitName: [
                    'organization'
                ],
                commonName: [
                    'dominio',
                    'www.dominio'
                ],
                emailAddress: nuevoUsuario.email
            }
        
        }

        
        fs.readFile(path.join(__dirname,'../Certificados/llavePrivada_Servidor.key'), function(err, contents) {
            openssl.importRSAPrivateKey(contents, 'servidorPass', function(err, key, cmd) {
                if(err) {
                    console.log(err);
                } else {	
                    openssl.generateCSR(csroptions, key, 'servidorPass', async function(err, csr, cmd) {
                        openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(err, crt, cmd) {
                            const existe = await User.find({email: nuevoUsuario.email});
                            if(existe.length == 0){
                                var hash = crypto.createHash('sha256').update(nuevoUsuario.email).digest('hex');
                                
                                var pathUsuario = '/Usuarios_CRT/'+hash;
    
                                var c = new FTPClient();
                                
                                console.log(IP);

                                c.connect({
                                    host: IP.dir,
                                    user: "diegoarturomg",
                                    password: "211096"
                                });
    
                                var rutaCRT = pathUsuario;
                                var rutaCSR = pathUsuario;
                        
                                c.on('ready', function() {
                                    c.mkdir(rutaCRT,true, async function (err) {
                                        c.put(crt, rutaCRT+'/'+hash+'.crt',function(err) {
                                            if (err) throw err;
                                        });
                                        c.put(csr, rutaCSR+'/'+hash+'.csr',function(err) {
                                            if (err) throw err;
                                        });
                                        await nuevoUsuario.save();
                                        res.json({status:1, email: nuevoUsuario.email});
                                    });

                                    
                                });
                                
                                
                            }else{
                                res.json({status: 0, email: nuevoUsuario.email});
                            }
                        });
                    });
                }
            });
        });
    }
    
});

module.exports = router;