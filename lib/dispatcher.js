'use strict';

const debug = require('debug')('eko:EkoQueueDispatcher/Dispatcher');
const jobRunner = require('./job-runner');

class Dispatcher {
  /**
   * Create new queue dispatcher
   * @param {Queue} queue
   * @param {string} prefix
   * @param {RedisClient} publisher
   * @param {Object} jobProvider
   */
  constructor(prefix, queue, publisher, jobProvider = {}) {
    this.prefix = prefix;
    this.queue = queue;
    this.publisher = publisher;
    this.jobProvider = jobProvider;
  }

  /**
   * Dispatch job and add to the queue
   * @param {string} job
   * @param {Array<any>} params
   */
  dispatch(job, ...params) {
    const instance = jobRunner(job, this.jobProvider);

    // If cannot intantiate just return and continue
    if (!instance) return;

    debug(`Dispatching ${job} with params ${params}`);
    this.queue.create(job, params)
      .priority(instance.priority)
      .save();

    this.publisher.publish(this.prefix, job);
  }
}

module.exports = Dispatcher;
