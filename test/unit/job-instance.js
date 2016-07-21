'use strict';

const sinon  = require('sinon');
const should = require('should');
require('should-sinon');

const path = require('path');
const jobsPath = path.join(path.dirname(__filename), '..', 'test-jobs');
const jobInstance = require('../../lib/job-instance');

describe('JobInstance', function () {

  describe('dispatch', function () {
    it('should run the handle method on the job instance', function (done) {
      const instance = jobInstance('email', jobsPath);

      instance.priority.should.equal(0);
      instance.concurrency.should.equal(1);

      instance.run({ data: 'data' }, () => done());
    });

    it('should not run the handle method on the job instance', function (done) {
      const instance = jobInstance('bad-email', jobsPath);

      instance.priority.should.equal(0);
      instance.concurrency.should.equal(1);

      instance.run({ data: 'data' }, () => done());
    });
  });
});
