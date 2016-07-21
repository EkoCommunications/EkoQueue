const path = require('path');
const jobPath = path.join(path.dirname(__filename), 'jobs');
const Queue = require('../index')({ jobPath });
const dispatcher = Queue.dispatcher();

dispatcher.dispatch('email', 'andru.weir@gmail.com', 'Hello');

setInterval(() => {
  dispatcher.dispatch('email', 'andru.weir@gmail.com', new Date);
}, 5000);
