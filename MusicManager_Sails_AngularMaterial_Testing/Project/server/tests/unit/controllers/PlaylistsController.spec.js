/**
 * Created by dminhquan on 3/11/2015.
 */
'use strict';

var request = require('supertest');

describe('PlaylistsController', function() {
  it('POST api/playlists/query', function(done) {
    request(sails.hooks.http.app)
      .post('/api/playlists/query')
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
