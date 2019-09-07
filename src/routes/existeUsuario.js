const {Router} = require('express');
const router = Router();
const User = require('../models/usuario')

router.post('/', async (req, res) => {
    const {email, password} = req.body;
    if(email && password){
        const existe = await User.find({email: email, password: password});
        if(existe.length == 0){
            res.json({status: 0});
        }else{
            res.json({status: 1, usuario: existe[0].email});
        }
    }
});

module.exports = router;