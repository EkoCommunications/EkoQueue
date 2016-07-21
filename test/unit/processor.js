'use strict';

const sinon  = require('sinon');
const should = require('should');
require('should-sinon');

const path = require('path');
const jobsPath = path.join(path.dirname(__filename), '..', 'test-jobs');
const Processor = require('../../lib/processor');

let queue;
let subscriber;

describe('Processor', function () {

  beforeEach(function (done) {
    /**
     * Mock Queue
     */
    queue = {
      process: sinon.stub().returnsThis(),
    };

    /**
     * Subscriber Mock
     */
    subscriber = {
      subscribe: sinon.stub(),
      on: sinon.stub(),
    };

    done();
  });

  describe('process', function () {
    it('should process a job from the queue', function (done) {
      const processor = new Processor('q', queue, subscriber, jobsPath);
      processor.process('email');

      queue.process.should.be.calledOnce().calledWith('email', 1);

      done();
    });

    it('should not process a job from the queue if the file does not exist', function (done) {
      const processor = new Processor('q', queue, subscriber, jobsPath);
      processor.process('do-not-exist');

      queue.process.should.not.be.calledOnce();

      done();
    });

    it('should not process if job already being processed', function (done) {
      const processor = new Processor('q', queue, subscriber, jobsPath);
      processor.processing.push('email');
      processor.process('email');

      queue.process.should.not.be.calledOnce();

      done();
    });
  });
});
