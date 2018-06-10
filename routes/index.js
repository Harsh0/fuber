'use strict';

const { Router } = require('express');
const router = Router();

const { 
    GetAllCabs,
    BookCab,
    EndRide
} = require('../Controller');


// Get all cabs in array
router.get('/cabs', GetAllCabs );

//book cab
router.post('/cabs/book', BookCab )

//end ride
router.post('/ride/end', EndRide)

module.exports = router;