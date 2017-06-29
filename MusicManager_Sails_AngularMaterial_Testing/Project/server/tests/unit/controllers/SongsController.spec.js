/**
 * Created by dminhquan on 3/3/2015.
 */
'use strict';

var request = require('supertest');

describe('songsController', function() {
  it('POST api/songs/query', function(done) {
    request(sails.hooks.http.app)
      .post('/api/songs/query')
      .send({
        limit: 10
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err){
          return done(err);
        }
        res.body.should.be.instanceof(Object);
        res.body.data.should.be.instanceof(Array);
        done();
      });
  });
});
