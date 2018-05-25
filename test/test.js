//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Fuber', () => {
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

    describe('/GET find cab', () => {
        it('should find a cab nearest to person', (done) => {
            chai.request(server)
            .get(`/cabs/find?latitude=${34.23}&longitude=${12.45}&color='Pink'`)
            .end((err, res) => {
                res.should.have.status(200);
            })
        })
    })
    after((done)=>{
        done();
    });
});