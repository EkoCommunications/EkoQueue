const path = require('path');
const jobsPath = path.join(path.dirname(__filename), 'jobs');
const Queue = require('../index')({ jobsPath });
const processor = Queue.processor();

processor.processAll();
