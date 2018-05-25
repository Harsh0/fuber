'use strict';

const { Router } = require('express');
const router = Router();

const Cab = require('../Entities/Cab');
const Ride = require('../Entities/Ride');

let cabs = require('../Data/cabs.json');

let rides = new Map();
//Initialize all cabs from cabs.json
cabs = cabs.map(e => {
    return new Cab(e.cabId, e.latitude, e.longitude, e.color);
})

let generateRandomId = () => {
    let id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    return id;
}

router.get('/cabs', (req, res, next) => {
    //list all available cabs
    res.json(cabs);
});

router.post('/cabs/book', (req, res, next) => {
    try{
        //extract latitude, longitude and color from querystring
        let { latitude, longitude, color } = req.body;
        let cabsArray = [].concat(cabs);
        cabsArray = cabsArray.filter(e => {
            return (color=='Pink'?e.color=='Pink':true)&&e.status=='free';
        });
        cabsArray.sort((a, b) => {
            return a.calculateDistance(latitude, longitude) - b.calculateDistance(latitude, longitude);
        })
        if(cabsArray.length){
            //if cab is available and more than 1 , assign the nearest cab
            let cabToBeAssigned = cabsArray[0];
            //change the status of cab, so that it cannot be booked till ride ends
            cabToBeAssigned.status = 'assigned';
            let ride = new Ride(cabToBeAssigned, latitude, longitude)
            let rideId = generateRandomId();
            //check if ride id has been already taken, if so generate new
            while(rides.has(rideId)){
                rideId = generateRandomId();
            }
            rides.set(rideId, ride);
            cabToBeAssigned =  Object.assign({},cabToBeAssigned)
            cabToBeAssigned.rideId = rideId;
            delete cabToBeAssigned.earnedMoney;
            cabToBeAssigned.distance =  cabsArray[0].calculateDistance(latitude,longitude)
            res.json(cabToBeAssigned);
        }else{
            res.status(400).json({
                message: 'Sorry! No Cab available'
            });
        }
    }catch(err){
        next(err)
    }
})

router.post('/ride/end', (req, res, next) => {
    try{
        let { rideId, latitude, longitude } = req.body;
        latitude = +latitude;
        longitude = +longitude;
        if(rides.has(rideId)){
            let ride = rides.get(rideId);
            try{
                let cost = ride.endRide(latitude, longitude);
                console.log(`Cost occured for ride is ${cost}`);
                res.json({
                    message: `Ride ended successfully, Please pay ${cost} dogecoin to driver`,
                    cost: cost
                })
            }catch(err){
                res.json({
                    message: err.message
                })
                return 
            }
        }else{
            res.status(400).json({
                message: 'Ride doesnt exist with rideId'
            });
        }
    }catch(err){
        next(err);
    }
})

module.exports = router;