const {Router} = require('express');
const router = Router();
const path = require('path');
var crypto = require('crypto');
var fs = require('fs');

const User = require('../models/usuario')

const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();

function obtenerCertificado(nuevoUsuario, res) {
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
    
    fs.readFile(path.join(__dirname,'../Certificados/llavePrivada_Servidor.key'), async function(err, contents) {
        openssl.importRSAPrivateKey(contents, 'servidorPass', async function(err, key, cmd) {
            if(err) {
                console.log(err);
            } else {
                var hash = crypto.createHash('sha256').update(nuevoUsuario.email).digest('hex');
                var pathUsuario = path.join(__dirname,'../../Usuarios_CRT/'+hash);
                if (fs.existsSync(pathUsuario)){
                    fs.readFile(pathUsuario+'/'+hash+'.csr', {encoding: 'utf-8'}, async function(err,csr){
                        if (!err) {
                            openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(err, crt, cmd) {
                                fs.writeFile(pathUsuario+'/'+hash+'.csr', csr, async function (err){
                                    fs.writeFile(pathUsuario+'/'+hash+'.crt', crt, async function (err) {
                                        if (err) {
                                            throw err;
                                        }else{
                                            res.json({status: 1});
                                        }
                                    });
                                });
                            });  
                        }else{
                            res.json({status:0});
                        }
                    });
                }else{
                    res.json({status:0});
                }
            }
        });
    });
}

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        var nuevoUsuario = new User();
        nuevoUsuario = existe[0];
        if(nuevoUsuario){
            obtenerCertificado(nuevoUsuario, res);
        }else{
            res.json({status:0});
        }
    }
});

module.exports = router;