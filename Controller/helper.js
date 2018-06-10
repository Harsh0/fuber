'use strict';
 
const Cab = require('../Entities/Cab');
const Ride = require('../Entities/Ride');

/**
 * @desc generate random id out of all alphabet and number
 * @return {String} random id
 */
exports.generateRandomId = () => {
    let id = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    return id;
}

/**
 * @desc generate unique ride id 
 * @param {Map<String, Ride>} rides rides map which is used to verify its generating unique id 
 * @return {String} unique ride id
 */
exports.generateUniqueRideId = (rides) => {
  let rideId = exports.generateRandomId();
  //check if ride id has been already taken, if so generate new
  while(rides.has(rideId)){
    rideId = exports.generateRandomId();
  }  
  return rideId;
}

/**
 * @desc initialize all cab and create cab type object
 * @param {Object[]} cabs array of cabs object taken from json
 * @return {Cab[]} array of cab type for all object
 */
exports.initCabs = (cabs) => {
    return cabs.map(cab => {
      return new Cab(cab.cabId, cab.latitude, cab.longitude, cab.color);
    })
}

/**
 * @desc validate latitude and longitude and throw error if there is something wrong
 * @param {number} latitude 
 * @param {number} longitude 
 * @throws {object} Error consist status and message
 */
exports.validateCordinates = (latitude, longitude) => {
  if(isNaN(latitude)||isNaN(longitude)){
    throw {
      status: 400, 
      message: 'latitude and longitude should be number'
    }
  }
  if(latitude<-90||latitude>90){
    throw {
      status: 400, 
      message: 'latitude range from -90 to +90'
    }
  }
  if(longitude<-180||longitude>180){
    throw {
      status: 400, 
      message: 'longitude range from -180 to +180'
    }
  }
}

/**
 * @desc calculate distance between cab and person using their cordinated
 * @param {Cab} cab 
 * @param {number} latitude 
 * @param {number} longitude 
 * @return {number} distance
 */
exports.calculateDistance = (cab, latitude, longitude) => {
  return + Math.sqrt(
      Math.pow(cab.latitude - latitude, 2)
      + Math.pow(cab.longitude - longitude, 2)
  ).toFixed(2);
}

/**
 * @desc find cab for given params out of cab array
 * @param {Cab[]} cabs 
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {string} color 
 * @return {Cab} founded cab
 */
exports.findCab = (cabs, latitude, longitude, color) => {
  let cabsArray = [].concat(cabs);
  // if color is 'Pink' filter all cabs whose color are 'Pink' and status is 'free'
  cabsArray = cabsArray.filter(e => {
      return (color=='Pink'?e.color=='Pink':true)&&e.status=='free';
  });
  if(cabsArray.length){
    //if cab is available and more than 1 ,sort according to distance and return the nearest cab
    cabsArray.sort((a, b) => {
        return exports.calculateDistance(a, latitude, longitude) > exports.calculateDistance(b, latitude, longitude);
    })
    return cabsArray[0];
  } else {
    //no cab found
    return null;
  }
}

/**
 * @desc assign cab to person while creating ride and retrun ride details
 * @param {string} rideId 
 * @param {Cab} cab 
 * @param {number} latitude 
 * @param {number} longitude 
 * @return {Ride} ride details
 */
exports.assignCab = (rideId, cab, latitude, longitude) => {
  //change the status of cab, so that it cannot be booked till ride ends
  cab.status = 'assigned';
  let ride = new Ride(rideId, cab, latitude, longitude)
  return ride;
}

/**
 * @desc Create ride response to return to user while not changing existing values
 * @param {Ride} ride 
 * @return {Object} ride summary
 */
exports.createRideResponse = (ride) => {
  //copy ride object for mutation that does not affect original
  let response =  Object.assign({},ride)
  //copy cab object also so it wont overwrite
  response.cab = Object.assign({},ride.cab);
  delete response.cab.earnedMoney;
  let { latitude, longitude } = response.startLocation;
  //calculate distance between cab and person
  response.distance = exports.calculateDistance(response.cab, latitude, longitude)
  return response;
}

/**
 * @desc ends ride for at perticular latitude and longitude
 * @param {Ride} ride 
 * @param {number} latitude 
 * @param {number} longitude 
 * @return {number} cost of ride
 * @throws {object} error if ride already ended
 */
exports.endRide = (ride, latitude, longitude) => {
  //check if ride has been ended
  if(ride.endTime){
    throw {
      status: 400,
      message: 'Ride has already been ended!'
    }
  }
  //set end time of ride
  ride.endTime = Date.now();
  //set end location
  ride.endLocation = {
      latitude,
      longitude
  }
  exports.calculateCost(ride);
  //set the location of cab to new latitude and longitude
  ride.cab.latitude = latitude;
  ride.cab.longitude = longitude;
  //free the cab to be used by other people
  ride.cab.status = 'free';
  //add earned money to cab
  ride.cab.earnedMoney += ride.cost;
  //return ride cost
  return ride.cost;
}

/**
 * @desc Calculate cost when ending ride and assign to ride.cost
 * @param {Ride} ride 
 */
exports.calculateCost = (ride) => {
  //add 2 coin per kilometer to cost, calculate distance from start location till end locatoion
  let { latitude, longitude } = ride.endLocation;
  ride.cost = 2 * Math.ceil(exports.calculateDistance(ride.startLocation, latitude, longitude));
  //add 1 coin per minute to cost
  ride.cost += Math.ceil((ride.endTime - ride.startTime)/(60 * 1000))
  //add 5 coin if color is 'Pink'
  if(ride.cab.color=='Pink'){
    ride.cost += 5; 
  }
}