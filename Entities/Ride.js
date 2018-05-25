
class Ride{
    constructor(cab, latitude, longitude){
        //start the ride
        this.cab = cab;
        this.startLocation = {
            latitude,
            longitude
        }
        this.startTime = Date.now();
        this.endTime = null;
        this.endLocation = null;
        this.cost = 0;//in doge coin
    }
    endRide(latitude, longitude){
        if(this.endTime){
            throw new Error('ride has already been ended!');
        }
        this.endTime = Date.now();
        this.endLocation = {
            latitude,
            longitude
        }
        //add 2 coin per kilometer to cost
        this.cost += 2 * Math.ceil(this.cab.calculateDistance(latitude, longitude));
        //add 1 coin per minute to cost
        this.cost += Math.ceil((this.endTime - this.startTime)/(60 * 1000))
        //add 5 coin if color is 'Pink'
        if(this.cab.color=='Pink'){
            this.cost += 5; 
        }
        //set the location of cab to new latitude and longitude
        this.cab.latitude = latitude;
        this.cab.longitude = longitude;
        //return ride cost
        return this.cost;
    }   
}


module.exports = Ride;