'use strict';

class EmailJob {
  /**
   * Create new email job
   * @param {Email} emailService
   */
  constructor(emailService) {
    this.emailService = emailService;
  }

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
    const result = yield this.emailService.send(email, subject, 'here is the body');
    console.log(result);
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
