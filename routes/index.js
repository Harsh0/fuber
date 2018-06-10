'use strict';

const { Router } = require('express');
const router = Router();

const { 
    GetAllCabs,
    BookCab,
    EndRide
} = require('../Controller');



router.get('/cabs', GetAllCabs );

router.post('/cabs/book', BookCab )

router.post('/ride/end', EndRide)

module.exports = router;