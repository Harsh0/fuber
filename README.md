# Fuber
A fleet management taxi service that allow users to find taxi on demand

## Disclaimer

A lot of things has not been impletemented and not taken into consideration like ride listing , notification to driver when ride requested etc as not part of problem statement

## Getting Started

To clone repository run `git clone https://github.com/Harsh0/fuber.git`

then `cd fuber`

To install all dependencies run `npm install`

To Test application run `npm test`

To Start application run `npm start`

Access the api from `http://localhost:8080/`

## See all available Cabs on UI

Go to [`http://localhost:8080/`](http://localhost:8080/) on browser

## Get all available cabs
To Get all available cabs [`GET /cabs`](http://localhost:8080/cabs)

you will get response like below

```
[
    {
        "cabId": 1,
        "latitude": 60.1575299,
        "longitude": 29.8465101,
        "color": "Aquamarine",
        "earnedMoney": 0,
        "status": "free"
    },
    {
        "cabId": 2,
        "latitude": 1.2255938,
        "longitude": -77.6611917,
        "color": "Turquoise",
        "earnedMoney": 0,
        "status": "free"
    },
    .
    .
    .
]
```

## Book a cab

To book a ride [`POST /cabs/book`](http://localhost:8080/cabs/book) with body

```
{
    "latitude":12.6587,
    "longitude": 67.876,
    "color": "Pink" //optional
}
```

you will get a response like below

```
{
    "rideId": "MQ4SRWBl9UjmcZIae6fx",
    "cab": {
        "cabId": 15,
        "latitude": 31.988669,
        "longitude": 100.682238,
        "color": "Pink",
        "status": "assigned"
    },
    "startLocation": {
        "latitude": 12.6587,
        "longitude": 67.876
    },
    "startTime": 1528627519144,
    "endTime": null,
    "endLocation": null,
    "cost": 0,
    "distance": 38.08
}
```

## End a ride

To end a ride [`POST /ride/end`](http://localhost:8080/ride/end) with body

```
{
    "latitude": 62.6587,
    "longitude": 27.876,
    "rideId": "MQ4SRWBl9UjmcZIae6fx"
}
```

you will get the response like below

```
{
    "message": "Ride ended successfully, Please pay 136 dogecoin to driver",
    "cost": 136
}
```