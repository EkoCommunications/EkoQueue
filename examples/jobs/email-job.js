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
