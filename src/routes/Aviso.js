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

router.get('/', (req, res) => {
    console.log('Entro');
    res.render('Aviso');
});

module.exports = router;