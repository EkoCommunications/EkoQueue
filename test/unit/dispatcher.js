const sinon  = require('sinon');
const should = require('should');
require('should-sinon');

const path = require('path');
const jobsPath = path.join(path.dirname(__filename), '..', '..', 'examples', 'jobs');
const Dispatcher = require('../../lib/dispatcher');

/**
 * Mock Queue
 */
const queue = {
  create:   sinon.stub().returnsThis(),
  priority: sinon.stub().returnsThis(),
  save:     sinon.stub().returnsThis(),
};

/**
 * Publisher Mock
 */
const publisher = { publish: sinon.stub() };

describe('Dispatcher', function () {
  describe('dispatch', function () {
    it('should dispatch a job to the queue', function (done) {
      const dispatcher = new Dispatcher('q', queue, publisher, jobsPath);
      dispatcher.dispatch('email', 'andrew@ekoapp.com');

      queue.create.should.be.calledOnce().calledWith('email', ['andrew@ekoapp.com']);
      queue.priority.should.be.calledOnce().calledWith(0);
      queue.save.should.be.calledOnce();

      publisher.publish.should.be.calledOnce('q', 'email');

      done();
    });
  });
});
