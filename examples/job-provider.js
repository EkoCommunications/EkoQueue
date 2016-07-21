const path = require('path');
const jobPath = path.join(path.dirname(__filename), 'jobs');

const Email = require('./services/email');
const EmailJob = require('./jobs/email-service-job');

/**
 * Wrap email job in function to inject dependencies.
 * These functions themselves cannot have any dependencies.
 * @return {EmailJob}
 */
const emailJob = () => {
  /**
   * Simulating instance of email client that sends email
   * @type {Object}
   */
  const emailClient = {
    send: (address, subject, body, callback) => {
      callback(null, `Email sent to ${address}`);
    },
  };

  /**
   * Email service
   * @type {Email}
   */
  const emailService = new Email(emailClient);

  /**
   * Finally instantiate and return email job with email service injected
   */
  return new EmailJob(emailService);
};

/**
 * Export the jobPath for job classes that require no dependency injection
 * and then export the jobs that have been initialized by their job name
 * @type {Object}
 */
module.exports = {
  jobPath,
  'email-service': emailJob(),
};
