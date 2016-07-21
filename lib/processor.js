'use strict';

const debug = require('debug')('eko:EkoQueueDispatcher/Processor');
const jobRunner = require('./job-runner');

class Processor {
  /**
   * Create new queue processor
   * @param {string} prefix
   * @param {Queue} queue
   * @param {RedisClient} subscriber
   * @param {string} jobsPath
   */
  constructor(prefix, queue, subscriber, jobsPath) {
    /**
     * Set of currently processing jobs
     * @type {Array}
     */
    this.processing = [];

    this.prefix = prefix;
    this.queue = queue;
    this.subscriber = subscriber;
    this.jobsPath = jobsPath;
  }

  /**
   * Process all job types in the queue
   */
  processAll() {
    this.subscriber.subscribe(this.prefix);
    this.subscriber.on('message', (channel, job) => {
      debug(`Subscriber received ${job} on channel ${channel}`);
      this.process(job);
    });

    // Prefetch current jobs from the queue
    this.queue.types((error, jobs) => {
      jobs.forEach(job => {
        this.process(job);
      });
    });
  }

  /**
   * Listen for jobs and process as they come in
   * @param {string} job
   */
  process(job) {
    if (this._isJobProcessing(job)) return;

    const instance = jobRunner(job, this.jobsPath);

    // If cannot intantiate just return and continue
    if (!instance) return;

    debug(`Waiting on jobs to process for ${job}`);
    this.processing.push(job);
    this.queue.process(job, instance.concurrency, (job, done) => {
      debug(job.type, job.data);
      instance.run(job, done);
    });
  }

  /**
   * Checks if job is currently processing
   * @param  {string} job
   * @return {Boolean}
   * @private
   */
  _isJobProcessing(job) {
    return (this.processing.indexOf(job) > -1);
  }
}

module.exports = Processor;
