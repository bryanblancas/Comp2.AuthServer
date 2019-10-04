const {Router} = require('express');
const User = require('../models/usuario')
const router = Router();

router.get('/', (req, res) => {
    res.render('Aviso');
});

module.exports = router;