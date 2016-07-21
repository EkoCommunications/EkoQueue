const path = require('path');
const jobPath = path.join(path.dirname(__filename), 'jobs');
const jobProvider = require('./job-provider');
const Queue = require('../index')({ jobPath });
const processor = Queue.processor();

processor.processAll();
