'use strict';

const debug = require('debug')('eko:EkoQueueDispatcher/Dispatcher');

class Dispatcher {
  /**
   * Create new queue dispatcher
   * @param {Queue} queue
   * @param {string} prefix
   * @param {RedisClient} publisher
   */
  constructor(prefix, queue, publisher) {
    this.prefix = prefix;
    this.queue = queue;
    this.publisher = publisher;
  }

  /**
   * Dispatch job and add to the queue
   * @param {string} job
   * @param {Array<any>} params
   */
  dispatch(job, params) {
    debug(`Dispatching ${job} with params ${params}`);
    this.queue.create(job, params).save();

    this.publisher.publish(this.prefix, job);
  }
}

module.exports = Dispatcher;
