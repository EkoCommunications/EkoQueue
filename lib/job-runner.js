'use strict';

const debug = require('debug')('eko:EkoQueueDispatcher/JobRunner');
const path = require('path');
const co = require('co');

/**
 * Find job class, instantiate and return
 * @param  {string} job
 * @param  {string} jobPath
 * @return {object|boolean}
 */
const instantiate = (job, jobPath) => {
  try {
    const jobModule = path.join(jobPath, `${job}-job`);
    const JobClass = require(jobModule);

    return new JobClass;
  } catch (error) {
    debug(`No job class found for ${job}`);

    return false;
  }
};

/**
 * Run the handle method for job instance. If job fails it
 * will run the failed method on the instance
 * @param  {string}   job
 * @param  {Function} done
 */
const runJob = (instance, job, done) => {
  co(function * () {
    yield instance.handle(...job.data);
    done();
  }).catch(error => {
    co(function * () {
      yield instance.failed(...job.data);
      done(error);

      debug(`Failed processing job ${job.type} with the error ${error.message}`);
    });
  });
};

/**
 * Constructor method for job instance
 * @param  {string} job
 * @param  {Object} jobProvider
 * @return {Object}
 */
module.exports = (job, jobProvider) => {
  let instance;

  /**
   * Check if job instance exists in job provider. If not
   * we check to see if jobPath exists in jobProvider. If it
   * does we then try to instantiate the module.
   */
  if (job in jobProvider) {
    instance = jobProvider[job];
  } else {
    if ('jobPath' in jobProvider) {
      instance = instantiate(job, jobProvider.jobPath);
    }
  }

  /**
   * If no instance exists we continue as normal
   */
  if (!instance) return;

  const priority = instance.priority || 0;
  const concurrency = instance.concurrency || 1;
  const run = (job, done) => runJob(instance, job, done);

  return { run, priority, concurrency };
};
