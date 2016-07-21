const kue = require('kue');
const Promise = require('bluebird');

class Kue {
  constructor({ prefix, host, port }) {
    this.queue = kue.createQueue({ prefix, redis: { host, port } });
  }

  createJob(job, params) {

  }

  processJob(job) {

  }

  getJobs() {

  }
}

module.exports = Kue;