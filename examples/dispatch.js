const Queue = require('./index')({});
const dispatcher = Queue.dispatcher();

dispatcher.dispatch('email', 'andru.weir@gmail.com', 'Hello');
dispatcher.dispatch('resize', '/path/to/image.jpeg', 100, 80);
dispatcher.dispatch('message', { from: 'Andrew', to: 'Jason', body: 'Hey how are you?' });

setInterval(() => {
  dispatcher.dispatch('date', new Date);
}, 5000);