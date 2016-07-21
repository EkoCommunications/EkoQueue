# EkoQueue

EkoQueue is a queue manager that allows you to easily dispatch and process jobs with an easy to use interface. EkoQueue wraps the excellent [kue.js](https://github.com/Automattic/kue) and also comes with a UI to monitor and manage the queue jobs.

EkoQueue is meant to be fully scalable with no persistance on disk. The only dependency is a Redis server.

## Requirements

* Node.js 6.*
* Redis Server

## Configuration

The queue module exposes a constructor function that accepts a hash of options.

* `host` (host for redis server)
* `port` (port for redis server)
* `prefix` (prefix to use for queue's jobs)
* `jobsPath` (path to job classes)

## Dispatching jobs

The queue dispatcher has a single method to dispatch jobs. The dispatch method takes the job name as the first paramater and following optional parameters act as the parameters for the handle method of the job class.

### Methods

* Dispatcher#dispatch(*string* job, *any* ...params)

### Examples

```javascript
const EkoQueue = require('eko-queue')({});
const dispatcher = Queue.dispatcher();

// Using additional parameters to pass through to the handle method
dispatcher.dispatch('email-user', 'andrew@ekoapp.com', 'Welcome Back!');

// Or you can just send an object through with your parameters
dispatcher.dispatch('email-user', {
  email: 'andrew@ekoapp.com',
  subject: 'Welcome Back!',
});
```

## Processing jobs

The queue processor has two (2) methods to process jobs. You can process a single job or process all the jobs. If running the `processAll` method it will also subscribe to dispatched jobs even after it is started.

### Methods

* Processor#process(*string* job)
* Processor#processAll()

### Examples

```javascript
const EkoQueue = require('eko-queue')({});
const processor = Queue.processor();

// Process individual job
processor.process('email-user');

// Process all jobs
processor.processAll();
```

## Job classes

The job classes are what the processor uses to process the job. Job classes must all live in the same directory and have a suffix of *job* in the filename. An example would be a job named **email** would have a filename of `email-job.js`.

The job class require a `handle` and `failed` method that both accept optional parameters that will be passed from the dispatcher. The job classes can also contain optional `concurrency` and `priority` properties.

### Example

```javascript
'use strict';

class EmailJob {
  /**
   * Number of jobs to run concurrently
   * @return {number}
   */
  get concurrency() {
    return 1;
  }

  /**
   * Priority of job 10 is lowest, -10 is highest
   * @return {number}
   */
  get priority() {
    return 0;
  }

  /**
   * Handle job
   * @param {string} email
   * @param {string} subject
   */
  * handle(email, subject) {
    console.log(`Sending email to ${email} with the subject ${subject}`);
  }

  /**
   * Handle job failure
   * @param {string} email
   * @param {string} subject
   */
  * failed(email, subject) {
    console.error(`Failed sending email to ${email} with the subject ${subject}`);
  }
}

module.exports = EmailJob;
```

## Running examples

Checkout this repository and run the following in two (2) different terminal sessions. The order does not matter.

    $ DEBUG=eko* nodemon examples/process.js
    $ DEBUG=eko* nodemon examples/dispatch.js

## Running the server

**Todo:** Export server from constructor. In the mean time you can checkout this repository and run `npm run server`.
