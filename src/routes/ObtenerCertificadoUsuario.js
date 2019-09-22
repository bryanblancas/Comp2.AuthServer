
const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();
const path = require('path');


router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        if(existe.length > 0){
            res.json({status: 1, certificado: existe[0].crt});
        }else{
            res.json({status: 0, email: email});
        }
    }
});


module.exports = router;