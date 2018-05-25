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
     * @description Test the /GET find cab route 
     */
    describe('/GET find cab', () => {
        it('should find a cab nearest to person and assign', (done) => {
            chai.request(server)
            .get(`/cabs/find?latitude=${34.23}&longitude=${12.45}&color='Pink'`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.color.should.be.a('string');
                res.body.status.should.be.equal('assigned');
                rideId = res.body.rideId;
                done();
            })
        })
    })
    /**
     * @description Test the /POST end ride route 
     */
    describe('/POST end ride', () => {
        it('should end the ride', (done) => {
            chai.request(server)
            .post(`/ride/end`)
            .send({ latitude: 38, longitude: 67, rideId: rideId})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.cost.should.be.equal(103);
                res.body.message.should.be.a('string');
                done()
            })
        })
    })
    after((done)=>{
        done();
    });
});