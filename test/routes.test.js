//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Product = require('../models/product');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app.js');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('API', () => {
    describe('Products', () => {
        beforeEach((done) => { //Before each test we empty the database
            Product.remove({}, (err) => { 
               done();           
            });        
        });
    /*
      * Test the /GET route
      */
      describe('/POST create new product', () => {
          it('it should create a new book', (done) => {
            chai.request(server)
                .post('/api/products/new')
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                  done();
                });
          });
      });
    
    });
});
