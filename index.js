const redis = require('redis');
const kue = require('kue');
const Processor = require('./lib/processor');
const Dispatcher = require('./lib/dispatcher');

module.exports = ({ prefix='ekoqueue', host='127.0.0.1', port=6379, jobsPath='jobs' }) => {
  const queue = kue.createQueue({ prefix, redis: { host, port } });

  // Gracefully stop processing queue jobs
  process.once('SIGTERM', sig => {
    queue.shutdown(1000, error => {
      console.log('Queue shutdown: ', error || '');
    });
  });

  const processor = () => {
    const subscriber = redis.createClient({ host, port });

    return new Processor(prefix, queue, subscriber, jobsPath);
  };

  const dispatcher = () => {
    const publisher = redis.createClient({ host, port });

    return new Dispatcher(prefix, queue, publisher, jobsPath);
  };

  return { processor, dispatcher };
};
