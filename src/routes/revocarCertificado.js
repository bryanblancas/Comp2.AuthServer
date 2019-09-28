const {Router} = require('express');
const router = Router();
const path = require('path');

//const certificado = require('../sample.json');
//console.log(certificado);
const User = require('../models/usuario')

/*Open SSL CERT*/
const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();
var fs = require('fs');

function obtenerCertificado(nuevoUsuario, res) {
    //console.log(nuevoUsuario);

    var csroptions = {
        hash: 'sha256',
        days: 365,
        extensions: {
            tlsfeature: ['status_request'],
            basicConstraints: {
                critical: true,
                CA: true,
                pathlen: 1
            },
            keyUsage: {
                critical: true,
                usages: [
                    'digitalSignature',
                    'keyEncipherment'
                ]
            },
            extendedKeyUsage: {
                critical: true,
                usages: [
                    'serverAuth',
                    'clientAuth',
                    'ipsecIKE',
                    'ipsecUser',
                    'ipsecTunnel',
                    'ipsecEndSystem'
                ]	
            },
            SANs: {
                DNS: [
                    nuevoUsuario.dominio,
                    'www.'+nuevoUsuario.dominio
                ]
            }
        },
        subject: {
            countryName: nuevoUsuario.ciudad,
            stateOrProvinceName: nuevoUsuario.estado,
            localityName: nuevoUsuario.localidad,
            postalCode: nuevoUsuario.codigoPostal,
            streetAddress: nuevoUsuario.direccion,
            organizationName: nuevoUsuario.organizacionNombre,
            organizationalUnitName: [
                nuevoUsuario.organizacionAbreviado
            ],
            commonName: [
                nuevoUsuario.dominio,
                'www.'+nuevoUsuario.dominio
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
                    /*console.log('===== CSR OPENSSL FUNCTION =====');
                    console.log(csr);
                    console.log('========================================');*/
                    
                    //csroptions.days = 365;
                    openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(err, crt, cmd) {
                        /*console.log('===== CRT OPENSSL FUNCTION =====');
                        console.log(crt);
                        console.log('========================================');*/
                    
                        //Se guarda en Base de datos Key, csr & crt
        
                        //key = key.split('-----BEGIN PRIVATE KEY-----')[1];
                        //key = key.split('-----END PRIVATE KEY-----')[0];
        
                        nuevoUsuario.crt = crt;
                        //nuevoUsuario.csr = csr;
        
                        const existe = await User.find({email: nuevoUsuario.email});
                        if(existe.length == 0){
                            //No existe usuario
                            res.json({status:0});
                        }else{
                            //Existe usuario
                            await nuevoUsuario.save();  
                            res.json({status: 1});
                        }
                    });
                });
            }
        });
    });
}

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        //Generar nuevo certificado y borrarlo
        const existe = await User.find({email: email, password: password});
        var nuevoUsuario = new User();
        nuevoUsuario = existe[0];
        //console.log(nuevoUsuario);;
        obtenerCertificado(nuevoUsuario, res);
    }
});

module.exports = router;