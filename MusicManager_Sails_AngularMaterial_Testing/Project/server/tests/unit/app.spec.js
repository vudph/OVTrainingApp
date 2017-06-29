'use strict';

describe('app', function() {
  it('Test connection', function() {
    return sails.connectedToDb;
  });
});
