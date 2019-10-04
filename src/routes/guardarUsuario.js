const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();
const path = require('path');
var crypto = require('crypto');

const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();
var fs = require('fs');

function obtenerCertificadoPrueba(nuevoUsuario, res) {

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
                    openssl.selfSignCSR(csr, csroptions, key, 'servidorPass', async function(err, crt, cmd) {
                        const existe = await User.find({email: nuevoUsuario.email});
                        if(existe.length == 0){
                            var hash = crypto.createHash('sha256').update(nuevoUsuario.email).digest('hex');
                            var pathUsuario = path.join(__dirname,'../../Usuarios_CRT/'+hash);
                            if (!fs.existsSync(pathUsuario)){
                                fs.mkdirSync(pathUsuario);
                                fs.writeFile(pathUsuario+'/'+hash+'.csr', csr, async function (err){
                                    fs.writeFile(pathUsuario+'/'+hash+'.crt', crt, async function (err) {
                                        if (err) {
                                            throw err;
                                        }else{
                                            nuevoUsuario.path = pathUsuario;
                                            await nuevoUsuario.save();
                                            res.json({status:1, certificado: nuevoUsuario.certificado, email: nuevoUsuario.email});
                                        }
                                    });
                                });
                            }else{
                                res.json({status: 0, email: nuevoUsuario.email});
                            }
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