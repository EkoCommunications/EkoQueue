const Queue = require('./index')({});
const processor = Queue.processor();

processor.processAll();