'use strict';

const { Router } = require('express');
const router = Router();

const Cab = require('../Entities/Cab');
const Ride = require('../Entities/Ride');

let cabs = require('../Data/cabs.json');

//Initialize all cabs from cabs.json
cabs = cabs.map(e => {
    return new Cab(e.cabId, e.latitude, e.longitude, e.color);
})

router.get('/cabs', (req, res, next) => {
    //list all available cabs
    res.json(cabs);
});


module.exports = router;