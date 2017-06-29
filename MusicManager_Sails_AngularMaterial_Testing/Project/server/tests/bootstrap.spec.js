/**
 * Created by dminhquan on 3/11/2015.
 */
'use strict';

var Sails = require('sails');
var  rc = require('rc');
var sails; //because sails is global variable in sailsJs;
var requireHelper = require('require_helper');
var db = requireHelper('api/services/dbService.js');

before(function(done) {
  Sails.lift(rc('sails'), function(err, server) {
    sails = server;

    db.connect(function success(){
      sails.connectedToDb = true;
    }, function error(){
      sails.connectedToDb = false;
    });

    if (err){
      return done(err);
    }
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(function(){
    db.disconnect(done);
  });
});
