
class Ride{
    constructor(rideId, cab, latitude, longitude){
        //start the ride
        this.rideId = rideId;
        this.cab = cab;
        this.cab.status = 'assigned';
        this.startLocation = {
            latitude,
            longitude
        }
        this.startTime = Date.now();
        this.endTime = null;
        this.endLocation = null;
        this.cost = 0;//in doge coin
    }
}


module.exports = Ride;