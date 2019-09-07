const {Router} = require('express');
const router = Router();

//const certificado = require('../sample.json');
//console.log(certificado);
const User = require('../models/usuario')

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        if(existe){
            res.json({status: 1});
        }else{
            res.json({status: 0});
        }
    }
});

module.exports = router;