const jobProvider = require('./job-provider');
const Queue = require('../index')(jobProvider, {});
const dispatcher = Queue.dispatcher();

dispatcher.dispatch('email', 'andrew@ekoapp.com', 'Hello');
dispatcher.dispatch('email-service', 'andrew@ekoapp.com', 'Hello from the service');

// setInterval(() => {
//   dispatcher.dispatch('email', 'andrew@ekoapp.com', new Date);
// }, 5000);
