//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Book = require('../models/user.model');

//Require the dev-dependencies
var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it

let chai1 = require('chai');
var chai = require('chai').assert
// let chaiHttp = require('chai-http');
chai.use(require("chai-http"));
var should = chai.should();
let server1 = require('../server');
let server=require('../routes/userRoute')
chai.use(chaiHttp);


//Our parent block
// describe('Books', () => {
//     beforeEach((done) => { //Before each test we empty the database
//         Book.remove({}, (err) => { 
//            done();           
//         });        
//     });
/*
  * Test the /GET route
  */
  describe('/userList', () => {
      it('it should GET all the details', (done) => {
        chai.request(server)
            .get('/userList')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });

// });