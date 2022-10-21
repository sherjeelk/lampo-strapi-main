'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {

  /**
   * This cron job runs to communicate with scheduler to refresh token every midnight
   * @returns {Promise<void>}
   */

  // 0 0 0 * * *

  '0 0 0 * * *': async () => {
    console.log("Looks like it's midnight :: Time to have some fun!");
    console.log("Preparing for token refresh");
    const token = await strapi.services.util.refreshToken();
    console.log('TOKEN is now updated!');
  }
};
