'use strict';

const sinon  = require('sinon');
const should = require('should');
require('should-sinon');

const path = require('path');
const jobPath = path.join(path.dirname(__filename), '..', 'test-jobs');
const jobRunner = require('../../lib/job-runner');

describe('jobRunner', function () {

  describe('dispatch', function () {
    it('should run the handle method on the job instance', function (done) {
      const instance = jobRunner('email', jobPath);

      instance.priority.should.equal(0);
      instance.concurrency.should.equal(1);

      instance.run({ data: 'data' }, () => done());
    });

    it('should not run the handle method on the job instance', function (done) {
      const instance = jobRunner('bad-email', jobPath);

      instance.priority.should.equal(0);
      instance.concurrency.should.equal(1);

      instance.run({ data: 'data' }, () => done());
    });
  });
});
