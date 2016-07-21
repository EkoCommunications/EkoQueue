const path = require('path');
const jobsPath = path.join(path.dirname(__filename), 'jobs');
const Queue = require('../index')({ jobsPath });
const dispatcher = Queue.dispatcher();

dispatcher.dispatch('email', 'andru.weir@gmail.com', 'Hello');

setInterval(() => {
  dispatcher.dispatch('email', 'andru.weir@gmail.com', new Date);
}, 5000);