class Cab{
    constructor(latitude, longitude, color){
        this.latitude = latitude;
        this.longitude = longitude;
        this.color = color;
        this.earnedMoney = 0;
        this.status = 'free';//'assigned' if assigned to customer
    }
    calculateDistance(latitude, longitude){
        return + Math.sqrt(
            Math.pow(this.latitude - latitude, 2)
            + Math.pow(this.longitude - longitude)
        ).toFixed(2);
    }
}

module.exports = Cab;