'use strict';

const debug = require('debug')('eko:EkoQueueDispatcher/Processor');
const jobRunner = require('./job-runner');

class Processor {
  /**
   * Create new queue processor
   * @param {string} prefix
   * @param {Queue} queue
   * @param {RedisClient} subscriber
   * @param {Object} jobProvider
   */
  constructor(prefix, queue, subscriber, jobProvider = {}) {
    /**
     * Set of currently processing jobs
     * @type {Object}
     */
    this.processing = {
      push: job => this.processing[job] = undefined,
    };

    this.prefix = prefix;
    this.queue = queue;
    this.subscriber = subscriber;
    this.jobProvider = jobProvider;
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

    const instance = jobRunner(job, this.jobProvider);

    // If cannot intantiate just return and continue
    if (!instance) return;

    debug(`Waiting on jobs to process for ${job}`);
    this.processing.push(job);

    this.queue.process(job, instance.concurrency, (job, ctx, done) => {
      this.processing[job.type] = ctx;
      debug(job.type, job.data);
      instance.run(job, done);
    });
  }

  /**
   * [processOnce description]
   * @param  {[type]} job [description]
   * @return {[type]}     [description]
   */
  processOnce(job) {
    this.process(job);

    // Wait for jobs to complete and pause if no more jobs left
    this.queue.on('job complete', (id) => {
      this.queue.inactiveCount(job, (err, count) => {
        if (count == 0 && this.processing[job] != undefined) {
          this.processing[job].pause(5000, err => {
            delete this.processing[job];
            debug(`${job} has been paused`, err);
          });
        }
      });
    });
  }

  /**
   * Checks if job is currently processing
   * @param  {string} job
   * @return {Boolean}
   * @private
   */
  _isJobProcessing(job) {
    return (Object.keys(this.processing).indexOf(job) > -1);
  }
}

module.exports = Processor;
