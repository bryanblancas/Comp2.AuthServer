const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();

/*Open SSL CERT*/
const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();

async function obtenerCertificado(email,ciudad,estado,localidad,codigoPostal,direccion,organizacionNombre,organizacionAbreviado,dominio) {
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
        openssl.generateCSR(csroptions, key, 'test', function(err, csr, cmd) {
                if(err) {
                        //console.log(err);
                        //console.log(cmd.files.config);
                } else {
                        //console.log(cmd);
                        //console.log(csr);
                        //console.log(cmd.files.config);
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
                                        return key;
                                }
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
        const privateKey = await obtenerCertificado(
            nuevoUsuario.email,
            nuevoUsuario.ciudad,
            nuevoUsuario.estado,
            nuevoUsuario.localidad,
            nuevoUsuario.codigoPostal,
            nuevoUsuario.direccion,
            nuevoUsuario.organizacionNombre,
            nuevoUsuario.organizacionAbreviado,
            nuevoUsuario.dominio
        );
        console.log(privateKey);
        //console.log(crt);
        //console.log(csr);
        nuevoUsuario.crt = 'crt';
        nuevoUsuario.csr = 'csr';
        nuevoUsuario.privateKey = 'privateKey';
        const existe = await User.find({email: nuevoUsuario.email});
        if(existe){
            await nuevoUsuario.save();  
            res.json({status:1, certificado: nuevoUsuario.certificado, email: nuevoUsuario.email});
        }else{
            res.json({status: 0, email: email});
        }
    }
    
});

module.exports = router;