'use strict';

const sinon  = require('sinon');
const should = require('should');
require('should-sinon');

const path = require('path');
const jobsPath = path.join(path.dirname(__filename), '..', '..', 'examples', 'jobs');
const Dispatcher = require('../../lib/dispatcher');

let queue;
let publisher;

describe('Dispatcher', function () {

  beforeEach(function (done) {
    /**
     * Mock Queue
     */
    queue = {
      create:   sinon.stub().returnsThis(),
      priority: sinon.stub().returnsThis(),
      save:     sinon.stub().returnsThis(),
    };

    /**
     * Publisher Mock
     */
    publisher = { publish: sinon.stub() };

    done();
  });

  describe('dispatch', function () {
    it('should dispatch a job to the queue', function (done) {
      const dispatcher = new Dispatcher('q', queue, publisher, jobsPath);
      dispatcher.dispatch('email', 'andrew@ekoapp.com');

      queue.create.should.be.calledOnce().calledWith('email', ['andrew@ekoapp.com']);
      queue.priority.should.be.calledOnce().calledWith(0);
      queue.save.should.be.calledOnce();

      publisher.publish.should.be.calledOnce().calledWith('q', 'email');

      done();
    });

    it('should not dispatch if job file not found', function (done) {
      const dispatcher = new Dispatcher('q', queue, publisher, jobsPath);
      dispatcher.dispatch('do-not-exist', 'andrew@ekoapp.com');

      queue.create.should.not.be.calledOnce();
      queue.priority.should.not.be.calledOnce();
      queue.save.should.not.be.calledOnce();

      publisher.publish.should.not.be.calledOnce();

      done();
    });
  });
});
