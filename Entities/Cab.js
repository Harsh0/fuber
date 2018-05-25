class Cab{
    constructor(latitude, longitude, color){
        this.latitude = latitude;
        this.longitude = longitude;
        this.color = color;
    }
    calculateDistance(latitude, longitude){
        return + Math.sqrt(
            Math.pow(this.latitude - latitude, 2)
            + Math.pow(this.longitude - longitude)
        ).toFixed(2);
    }
}

module.exports = Cab;