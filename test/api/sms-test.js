var RSVP = require('rsvp');
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

    it('should find a revision', function (done) {
        sandbox.stub(Revision, 'findOne').withArgs({ where: { id: '12345' }, attributes: {exclude: ['reverse_patch']}}).returns(RSVP.resolve(mockRevision));

        request(app)
            .get('/cvcs-tank/systems/CB/revisions/12345')
            .set('X-FT-USER', 'junyi')
            .expect(200)
            .end(function (err, res) {
                if (err) {return done(err);}
                expect(res.body.id).to.equal(mockRevision.id);
                expect(res.body.configuration_id).to.equal(mockRevision.configuration_id);
                expect(res.body.system).to.equal(mockRevision.system);
                expect(res.body.user).to.equal(mockRevision.user);
                expect(res.body.patch).to.equal(mockRevision.patch);
                expect(res.body.hash).to.equal(mockRevision.hash);
                done();
            });
    });

    it('should find nothing', function (done) {
        sandbox.stub(Revision,'findOne').withArgs({ where: { id: '12345' }, attributes: {exclude: ['reverse_patch']}}).returns(RSVP.resolve(null));
        request(app)
            .get('/cvcs-tank/systems/CB/revisions/12345')
            .set('X-FT-USER', 'junyi')
            .expect(404)
            .end(function (err, res) {
                if (err) {return done(err);};
                expect(res.body.error).to.equal('Not found Revision by id 12345');
                done();
            });
    });

})
