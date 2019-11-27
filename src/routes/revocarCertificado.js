const {Router} = require('express');
const router = Router();
const path = require('path');
var crypto = require('crypto');
var fs = require('fs');

const {IP} = require('./IpClass');

const User = require('../models/usuario')

const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();

var FTPClient = require('ftp');

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: crypto.createHash('sha256').update(password).digest('hex')});
        var nuevoUsuario = new User();
        nuevoUsuario = existe[0];
        if(nuevoUsuario){
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
                        res.json({status:0});
                    } else {	
                        openssl.generateCSR(csroptions, key, 'servidorPass', async function(err, csr, cmd) {
                            openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(err, crt, cmd) {
                                
                                var hash = crypto.createHash('sha256').update(nuevoUsuario.email).digest('hex');
                                
                                var pathUsuario = '/Usuarios_CRT/'+hash;
    
                                var c = new FTPClient();
                                
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
                                        nuevoUsuario.path = pathUsuario;
                                        await nuevoUsuario.save();
                                        res.json({status: 1});
                                    });

                                    
                                });
                            });
                        });
                    }
                });
            });
        }else{
            res.json({status:0});
        }
    }
});

module.exports = router;