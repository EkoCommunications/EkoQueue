const redis = require('redis');
const kue = require('kue');
const Processor = require('./lib/processor');
const Dispatcher = require('./lib/dispatcher');

module.exports = (jobProvider, { prefix='ekoqueue', host='127.0.0.1', port=6379 }) => {
  const queue = kue.createQueue({ prefix, redis: { host, port } });

  const processor = () => {
    const subscriber = redis.createClient({ host, port });

    return new Processor(prefix, queue, subscriber, jobProvider);
  };

  const dispatcher = () => {
    const publisher = redis.createClient({ host, port });

    return new Dispatcher(prefix, queue, publisher, jobProvider);
  };

  return { processor, dispatcher };
};
