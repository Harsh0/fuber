class Cab{
    constructor(cabId, latitude, longitude, color){
        this.cabId = cabId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.color = color;
        this.earnedMoney = 0;
        this.status = 'free';//'assigned' if assigned to customer
    }
}

module.exports = Cab;