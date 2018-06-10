//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Fuber', () => {
    let rideId;

    before((done) => {
       done()
    });
    
    /**
     * @description Test the /GET cab route 
     */
    describe('/GET cabs',() => {
        it('should GET all the cabs', (done) => {
            chai.request(server)
            .get('/cabs')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });

    /**
     * @description Test the /GET find cab route while passing wrong latutude longitude value
     */
    describe('/GET find cab wrong latitude longitude value', () => {
        it('should throw error as passing latitude value as string', (done) => {
            chai.request(server)
            .post(`/cabs/book`)
            .send({ latitude: 'wrong', longitude: 12.45, color: 'Pink' })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.a('string')
                res.body.error.should.be.equal('latitude and longitude should be number')
                done();
            })
        })
        it('should throw error as passing wrong latitude value', (done) => {
            chai.request(server)
            .post(`/cabs/book`)
            .send({ latitude: 134.23, longitude: 12.45, color: 'Pink' })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.a('string')
                res.body.error.should.be.equal('latitude range from -90 to +90')
                done();
            })
        })
        it('should throw error as passing wrong longitude value', (done) => {
            chai.request(server)
            .post(`/cabs/book`)
            .send({ latitude: 14.23, longitude: 222.45, color: 'Pink' })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.a('string')
                res.body.error.should.be.equal('longitude range from -180 to +180')
                done();
            })
        })
    })


    /**
     * @description Test the /GET find cab route 
     */
    describe('/GET find cab', () => {
        it('should find a cab nearest to person and assign', (done) => {
            chai.request(server)
            .post(`/cabs/book`)
            .send({ latitude: 34.23, longitude: 12.45, color: 'Pink' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.rideId.should.be.a('string');
                res.body.cab.should.be.a('object');
                res.body.cab.cabId.should.be.a('number');
                res.body.cab.status.should.be.equal('assigned');
                res.body.cab.color.should.be.equal('Pink');
                res.body.startLocation.should.be.a('object');
                res.body.startLocation.should.be.a('object');
                res.body.startLocation.latitude.should.be.equal(34.23);
                res.body.startLocation.longitude.should.be.equal(12.45);
                res.body.distance.should.be.a('number');
                rideId = res.body.rideId;
                done();
            })
        })
    })

    /**
     * @desc Test the /Get find cab route when all Pink cabs are booked
     */
    describe('/Get find Cab', () => {
        before((done) => {
            // book all Pink cab
            let bookPinkcab = () => {
                chai.request(server)
                .post('/cabs/book')
                .send({latitude:3.78, longitude:34.78, color: 'Pink'})
                .end((err, res) => {
                    if(res.status == 200){
                        bookPinkcab();
                    }else{
                        done();
                    }
                })
            }
            bookPinkcab();
        });
        it('should not find a cab as we had book all cabs previously', (done) => {
            chai.request(server)
            .post(`/cabs/book`)
            .send({ latitude: 34.23, longitude: 12.45, color: 'Pink' })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.equal('Sorry! No Pink Cab available')
                done();
            })
        })
    })
    
    /**
     * @description Test the /GET find cab route 
     */
    describe('/GET find cab', () => {
        it('should find a non Pink cab nearest to person and assign as all Pink cabs are booked', (done) => {
            chai.request(server)
            .post(`/cabs/book`)
            .send({ latitude: 34.23, longitude: 12.45 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.rideId.should.be.a('string');
                res.body.cab.should.be.a('object');
                res.body.cab.cabId.should.be.a('number');
                res.body.cab.status.should.be.equal('assigned');
                res.body.cab.color.should.be.a('string');
                res.body.startLocation.should.be.a('object');
                res.body.startLocation.should.be.a('object');
                res.body.startLocation.latitude.should.be.equal(34.23);
                res.body.startLocation.longitude.should.be.equal(12.45);
                res.body.distance.should.be.a('number');
                rideId = res.body.rideId;
                done();
            })
        })
    })

    /**
     * @desc Test the /Get find cab route when all other cabs are booked
     */
    describe('/Get find Cab', () => {
        //book all other cabs
        before((done) => {
            // book all Pink cab
            let bookCab = () => {
                chai.request(server)
                .post('/cabs/book')
                .send({latitude:3.78, longitude:34.78})
                .end((err, res) => {
                    if(res.status == 200){
                        bookCab();
                    }else{
                        done();
                    }
                })
            }
            bookCab();
        });
        it('should not find a cab as we had book all cabs previously', (done) => {
            chai.request(server)
            .post(`/cabs/book`)
            .send({ latitude: 34.23, longitude: 12.45 })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.equal('Sorry! No Cab available')
                done();
            })
        })
    })
    /**
     * @description Test the /POST end ride route 
     */
    describe('/POST end ride', () => {
        it('should throw error for passing wrong ride id', (done) => {
            chai.request(server)
            .post(`/ride/end`)
            .send({ latitude: 38, longitude: 67, rideId: '4367890876'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.error.should.be.a('string')
                res.body.error.should.be.equal('Ride doesnt exist with rideId')
                done();
            })
        })
        it('should end the ride', (done) => {
            chai.request(server)
            .post(`/ride/end`)
            .send({ latitude: 38, longitude: 67, rideId: rideId})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.cost.should.be.a('number')
                res.body.message.should.be.a('string');
                done();
            })
        })
        it('should throw error to end the same ride', (done) => {
            chai.request(server)
            .post(`/ride/end`)
            .send({ latitude: 38, longitude: 67, rideId: rideId})
            .end((err, res) => {
                res.should.have.status(400);
                //approximate cost for test case
                res.body.error.should.be.a('string');
                res.body.error.should.be.equal('Ride has already been ended!');
                done();
            })
        })
    })
    after((done)=>{
        done();
    });
});