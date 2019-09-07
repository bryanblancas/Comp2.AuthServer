const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        //console.log(existe);
        if(existe.length > 0)
            res.json({status: 1, certificado: existe[0].certificado});
        else
            res.json({status: 0, email: email});
    }
});

router.get('/', async (req, res) => {
    console.log('entro');
    //console.log(req.query.email);
    const email = req.query.email;
    const password = req.query.password;
    //const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        //console.log(existe);
        if(existe.length > 0)
            res.json({status: 1, certificado: existe[0].certificado});
        else
            res.json({status: 0, email: email});
    }
});

module.exports = router;