'use strict';

//var RSVP = require('rsvp');
var sinon = require('sinon');
//var mockRevision = require('../mock_data/revision-get-testdata').revision;
var app = require('../test-app');
var request = require('supertest');

describe('GET /sms', function () {
    var sandbox;

    beforeEach(function() {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should return a chat list', function (done) {
        //sandbox.stub(Revision, 'findOne').withArgs({ where: { id: '12345' }, attributes: {exclude: ['reverse_patch']}}).returns(RSVP.resolve(mockRevision));

        request(app)
            .get('/sms')
            //.set('X-FT-USER', 'junyi')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err);}
                expect(res.body.length).to.equal(25);
                done();
            });
    });

});
