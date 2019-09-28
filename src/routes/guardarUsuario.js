const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();
const path = require('path');

/*Open SSL CERT*/
const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();
var fs = require('fs');

const opensslNode = require('openssl-nodejs');

/*opensslNode(['req', '-out', 'CSR.csr', '-new', '-newkey', 'rsa:2048', '-nodes', '-keyout', 'privateKey.key'], function (err, buffer) {
    console.log('-----');
    console.log(err.toString(), buffer.toString());
});*/

/*function obtenerCertificado(email,ciudad,estado,localidad,codigoPostal,direccion,organizacionNombre,organizacionAbreviado,dominio) {
        
    var valores = {key: '', csr: '', crt: ''};

    var rsakeyoptions = {
        encryption: {
            password: 'test',
            cipher: 'des3'
        },
        rsa_keygen_bits: 2048,
        //rsa_keygen_pubexp: 65537,
        format: 'PKCS8'
    }
    
    var ecckeyoptions = {
        encryption: {
            password: 'test',
            cipher: 'des3'
        },
        curve: 'prime256v1',
        //rsa_keygen_pubexp: 65537,
        format: 'PKCS8'
    }
    
    var csroptions = {
        hash: 'sha512',
        days: 240,
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
                    dominio,
                    'www.'+dominio
                ]
            }
        },
        subject: {
            countryName: ciudad,
            stateOrProvinceName: estado,
            localityName: localidad,
            postalCode: codigoPostal,
            streetAddress: direccion,
            organizationName: organizacionNombre,
            organizationalUnitName: [
                organizacionAbreviado
            ],
            commonName: [
                dominio,
                'www.'+dominio
            ],
            emailAddress: email
        }
    
    }
    
    var netcertoptions = {
        hostname: 'barracuda1.smhplus.org',
        port: 25,
        starttls: true,
        protocol: 'smtp'
    }
    
    var netcertoptions = {
        hostname: '47.91.46.102',
        port: 443,
        starttls: false,
        //protocol: 'https'
    }
    
    openssl.generateRSAPrivateKey({}, function(err, key, cmd) {
        //console.log(cmd);
        //console.log(key);
        valores.key = key;
        openssl.generateCSR(csroptions, key, 'test', function(err, csr, cmd) {
                if(err) {
                        //console.log(err);
                        //console.log(cmd.files.config);
                } else {
                        //console.log(cmd);
                        //console.log(csr);
                        //console.log(cmd.files.config);
                        valores.csr = csr;
                        csroptions.days = 365;
                        openssl.selfSignCSR(csr, csroptions, key, 'test', function(err, crt, cmd) {
                                if(err) {
                                        //console.log(err);
                                        //console.log(cmd.files.config);
                                } else {
                                        //console.log(cmd.command);
                                        //console.log(key);
                                        //console.log(csr);
                                        //console.log(crt);
                                        //console.log(cmd.files.config);
                                        //return key;
                                        valores.crt = crt;
                                        return valores;
                                }
                        });
                }
    
        });
    });
}*/

function obtenerCertificadoPrueba(nuevoUsuario, res) {
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
                        nuevoUsuario.csr = csr;
        
                        const existe = await User.find({email: nuevoUsuario.email});
                        if(existe.length == 0){
                            await nuevoUsuario.save();  
                            res.json({status:1, certificado: nuevoUsuario.certificado, email: nuevoUsuario.email});
                        }else{
                            res.json({status: 0, email: nuevoUsuario.email});
                        }
                    
                    });
        
                });
            }
        });
    });

}

router.post('/', async (req, res) => {
    const {username, email, password, ciudad, estado, localidad, codigoPostal, direccion, organizacionNombre, organizacionAbreviado, dominio} = req.body;
    if(username && email && password && ciudad && estado && localidad && codigoPostal && direccion && organizacionNombre && organizacionAbreviado && dominio){
        const nuevoUsuario = new User();
        nuevoUsuario.username = username;
        nuevoUsuario.email = email;
        nuevoUsuario.password = password;
        nuevoUsuario.ciudad = ciudad;
        nuevoUsuario.estado = estado;
        nuevoUsuario.localidad = localidad;
        nuevoUsuario.codigoPostal = codigoPostal;
        nuevoUsuario.direccion = direccion;
        nuevoUsuario.organizacionNombre = organizacionNombre;
        nuevoUsuario.organizacionAbreviado = organizacionAbreviado;
        nuevoUsuario.dominio = dominio;

        obtenerCertificadoPrueba(nuevoUsuario,res);
    }
    
});

module.exports = router;