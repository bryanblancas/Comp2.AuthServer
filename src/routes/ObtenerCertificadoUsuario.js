
const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();
const path = require('path');

/*Open SSL CERT*/
const node_openssl = require('node-openssl-cert');
const openssl = new node_openssl();


function prueba() {
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
                    'certificatetools.com',
                    'www.certificatetools.com'
                ]
            }
        },
        subject: {
            countryName: 'US',
            stateOrProvinceName: 'Louisiana',
            localityName: 'Slidell',
            postalCode: '70458',
            streetAddress: '1001 Gause Blvd.',
            organizationName: 'SMH',
            organizationalUnitName: [
                    'IT'
            ],
            commonName: [
                    'certificatetools.com',
                    'www.certificatetools.com'
            ],
            emailAddress: 'lyas.spiehler@slidellmemorial.org'
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
        console.log(cmd);
        console.log(key);
        openssl.generateCSR(csroptions, key, 'test', function(err, csr, cmd) {
                if(err) {
                        console.log(err);
                        console.log(cmd.files.config);
                } else {
                        console.log(cmd);
                        console.log(csr);
                        console.log(cmd.files.config);
                        csroptions.days = 365;
                        openssl.selfSignCSR(csr, csroptions, key, 'test', function(err, crt, cmd) {
                                if(err) {
                                        console.log(err);
                                        console.log(cmd.files.config);
                                } else {
                                        console.log(cmd.command);
                                        console.log(crt);
                                        console.log(cmd.files.config);
                                }
                        });
                }
    
        });
    });
}


router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        prueba();
        if(existe.length > 0){
            res.json({status: 1, certificado: existe[0].certificado});
        }else{
            res.json({status: 0, email: email});
        }
    }
});


module.exports = router;