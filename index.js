const redis = require('redis');

module.exports = ({ prefix='ekoqueue', host='127.0.0.1', port=6379 }) => {
  const queue = kue.createQueue({ prefix, redis: { host, port } });

  const processor = () => {
    const Processor = require('./lib/processor');
    const subscriber = redis.createClient({ host, port });

    return new Processor(prefix, queue, subscriber);
  };

  const dispatcher = () => {
    const Dispatcher = require('./lib/dispatcher');
    const publisher = redis.createClient({ host, port });

    return new Dispatcher(prefix, queue, publisher);
  };

  return { processor, dispatcher };
};
