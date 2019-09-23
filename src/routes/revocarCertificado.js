const {Router} = require('express');
const router = Router();

//const certificado = require('../sample.json');
//console.log(certificado);
const User = require('../models/usuario')

/*Open SSL CERT*/
const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();

function obtenerCertificado(nuevoUsuario, res) {
    //console.log(nuevoUsuario);

    var csroptions = {
        hash: 'sha512',
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

    openssl.generateRSAPrivateKey({}, async function(err, key, cmd) {
        /*console.log('===== PRIVATE KEY OPENSSL FUNCTION =====');
        console.log(key);
        console.log('========================================');*/

        openssl.generateCSR(csroptions, key, 'test', async function(err, csr, cmd) {
            /*console.log('===== CSR OPENSSL FUNCTION =====');
            console.log(csr);
            console.log('========================================');*/
            
            //csroptions.days = 365;
            openssl.selfSignCSR(csr, csroptions, key, 'test', async function(err, crt, cmd) {
                /*console.log('===== CRT OPENSSL FUNCTION =====');
                console.log(crt);
                console.log('========================================');*/
            
                //Se guarda en Base de datos Key, csr & crt

                //key = key.split('-----BEGIN PRIVATE KEY-----')[1];
                //key = key.split('-----END PRIVATE KEY-----')[0];

                nuevoUsuario.crt = crt;
                nuevoUsuario.csr = csr;
                nuevoUsuario.privateKey = key;
                
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