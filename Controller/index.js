let cabs = require('../Data/cabs.json');

let rides = new Map();

//import all helper functions 
const Helper = require('./helper');

//Initialize all cabs from cabs.json to Cab class
cabs = Helper.initCabs(cabs);


exports.GetAllCabs = (req, res, next) => {
    try{
        //list all available cabs
        res.json(cabs);
    }catch(err){
        next(err)
    }
}

exports.BookCab = (req, res, next) => {
    try{
        //extract latitude, longitude and color from querystring for finding cab
        let { latitude, longitude, color } = req.body;
        //convert string to integer for safety purpose
        latitude = +latitude;
        longitude = +longitude;
        Helper.validateCordinates(latitude, longitude);
        //find cab for requirement
        let cab = Helper.findCab(cabs, latitude, longitude, color)
        if(cab){
            //if cab found, assign the cab
            //generate unique ride id for ride
            let rideId = Helper.generateUniqueRideId(rides);
            //assign the cab with specified parameter
            let ride  = Helper.assignCab(rideId, cab, latitude, longitude);
            //set ride to rides map for searching purpose
            rides.set(rideId, ride);
            //create resposne for ride
            let response = Helper.createRideResponse(ride);
            //send response
            res.json(response);
        }else{
            //if cab doesn't found, send error response
            res.status(400).json({
                error: `Sorry! No ${color=='Pink'?'Pink ':''}Cab available`
            });
        }
    }catch(err){
        next(err)
    }
}

exports.EndRide = (req, res, next) => {
    try{
        //extract rideid, latitude and longitude
        let { rideId, latitude, longitude } = req.body;
        latitude = +latitude;
        longitude = +longitude;
        Helper.validateCordinates(latitude, longitude);
        //check if ride exist for perticular rideid
        if(rides.has(rideId)){
            let ride = rides.get(rideId);
            try{
                let cost = Helper.endRide(ride, latitude, longitude);
                //send cost in response
                res.json({
                    message: `Ride ended successfully, Please pay ${cost} dogecoin to driver`,
                    cost: cost
                })
            }catch(err){
                next(err); 
            }
        }else{
            res.status(400).json({
                error: 'Ride doesnt exist with rideId'
            });
        }
    }catch(err){
        next(err);
    }
}