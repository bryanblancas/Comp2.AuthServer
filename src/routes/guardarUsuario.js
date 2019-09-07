const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();


router.post('/', async (req, res) => {
    const {username, email, password} = req.body;
    if(username && email && password){
        const nuevoCertificado = obtenerCertificado();
        const nuevoUsuario = new User();
        nuevoUsuario.username = username;
        nuevoUsuario.email = email;
        nuevoUsuario.password = password;
        nuevoUsuario.certificado = nuevoCertificado;
        const existe = await User.find({email: nuevoUsuario.email});
        if(existe){
            await nuevoUsuario.save();  
            res.json({status:1, certificado: nuevoUsuario.certificado, email: nuevoUsuario.email});
        }else{
            res.json({status: 0, email: email});
        }
    }
    
});

function obtenerCertificado() {
    return 'MIID8TCCAtmgAwIBAgIULyjMD+eCWpSepd66adinmT649IEwDQYJKoZIhvcNAQEL'+
            'BQAwgYcxCzAJBgNVBAYTAk1YMQ8wDQYDVQQIDAZNZXhpY28xDzANBgNVBAcMBk1l'+
            'eGljbzEMMAoGA1UECgwDSVBOMQ4wDAYDVQQLDAVFU0NPTTEOMAwGA1UEAwwFRVND'+
            'T00xKDAmBgkqhkiG9w0BCQEWGWRpZWdvYXJ0dXJvMjEyMUBnbWFpbC5jb20wHhcN'+
            'MTkwODE0MDQwNjM4WhcNMjAwODEzMDQwNjM4WjCBhzELMAkGA1UEBhMCTVgxDzAN'+
            'BgNVBAgMBk1leGljbzEPMA0GA1UEBwwGTWV4aWNvMQwwCgYDVQQKDANJUE4xDjAM'+
            'BgNVBAsMBUVTQ09NMQ4wDAYDVQQDDAVFU0NPTTEoMCYGCSqGSIb3DQEJARYZZGll'+
            'Z29hcnR1cm8yMTIxQGdtYWlsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC'+
            'AQoCggEBALlRGgogxoGk1+x21biE4icJMDq7wOBHfVom5xi2jOaGzrAmoS1XPv3C'+
            'ld4vSmJIFH7+zwyQL8y1Pi0GrPnbbQAOW8eD5lZEc+fRoMKkXjJ2U8IcEQ2kv3G6'+
            'JDAGpwZWkKfVe7AvDtQSI/1WM7mFkl3Lf75dSb2pkqSiJ21qAMSVmCUnFbVmoEJL'+
            'i17vHxGqXBE3TTSh2Sgsu+Ia7irgxUOVj3EN62ReoLIbgKwAYneN21MuqYjqZCss'+
            'ROuHIZbwy5qM77O+ypdAcKEWoAHhQXOI2QV2oO+qz3vtneC+H4WDF0zZd/yIdx4S'+
            'KAyzcEhm4SXuabHOOnymT9hoEuazqEkCAwEAAaNTMFEwHQYDVR0OBBYEFP9xMM1K'+
            'XTiFNjOjteocPjEvEXeTMB8GA1UdIwQYMBaAFP9xMM1KXTiFNjOjteocPjEvEXeT'+
            'MA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAHYsQL+CYB9Ut1rZ'+
            'lM1Sc9v2iFwG8sJmBAi7xyS+JVV/BDZpVdzfuaKuCACv4dbEO0mvWLj49UkdiGRq'+
            'E5w4ji0BRNPdYgEIb8bI6DE36UKlrVJzHMgwQghAYdgMmfOiipjH8FM43abB3xW/'+
            'e9xIIKzqpqeADub8HlUM4s6Laal5WELY4RQzCk9TrBAxkXdYZvM+L0NhBV+M34iF'+
            'e1o1+d+cqhcUCix3lPp/qFFKvgWTHi6OLNolcNal1MF8mwJKc0ate51eBzPl1wVj'+
            'YXA++qfkEqRDiAFFte8V8Gxf5FZsZOwQGfalV4U1zGcxsy187u6Qww5rq8FNAMLD'+
            'gWLNdGg=';
}

module.exports = router;