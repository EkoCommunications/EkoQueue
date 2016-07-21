'use strict';

const sinon  = require('sinon');
const should = require('should');
require('should-sinon');

const path = require('path');
const jobProvider = require('../test-jobs/job-provider');
const jobRunner = require('../../lib/job-runner');

describe('jobRunner', function () {

  describe('dispatch', function () {
    it('should run the handle method on the job instance', function (done) {
      const instance = jobRunner('email', jobProvider);

      instance.priority.should.equal(0);
      instance.concurrency.should.equal(1);

      instance.run({ data: 'data' }, () => done());
    });

    it('should not run the handle method on the job instance', function (done) {
      const instance = jobRunner('bad-email', jobProvider);

      instance.priority.should.equal(0);
      instance.concurrency.should.equal(1);

      instance.run({ data: 'data' }, () => done());
    });

    it('should run a job from the job provider', function (done) {
      const instance = jobRunner('email-service', jobProvider);

      instance.priority.should.equal(0);
      instance.concurrency.should.equal(1);

      instance.run({ data: 'data' }, () => done());
    });

    it('should not run any jobs if job provider has no jobPath', function (done) {
      const instance = jobRunner('do-not-exist', {});

      done();
    });
  });
});
