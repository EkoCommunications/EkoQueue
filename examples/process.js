const jobProvider = require('./job-provider');
const Queue = require('../index')(jobProvider, {});
const processor = Queue.processor();

processor.processAll();
