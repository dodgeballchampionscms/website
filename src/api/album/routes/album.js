'use strict';

/**
 * album router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::album.album', {
  config: {
    find: {
      policies: ['api::album.is-team-owner']
    },
    findOne: {
      policies: ['api::album.is-team-owner']
    },
    create: {
      policies: ['api::album.is-team-owner']
    },
    update: {
      policies: ['api::album.is-team-owner']
    },
    delete: {
      policies: ['api::album.is-team-owner']
    }
  }
});
