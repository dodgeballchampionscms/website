'use strict';

/**
 * album controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::album.album', ({ strapi }) => ({
  async find(ctx) {
    const { user } = ctx.state;

    // If user is authenticated, check if they should see only their team's albums
    if (user && user.teamSlug) {
      // Check if user is admin
      const role = await strapi.query('plugin::users-permissions.role').findOne({
        where: { id: user.role.id }
      });

      // If not admin, filter by team
      if (role && role.type !== 'admin') {
        // Find the team by slug
        const teams = await strapi.entityService.findMany('api::team.team', {
          filters: { teamSlug: user.teamSlug }
        });

        if (teams.length > 0) {
          // Add filter to only show albums for this team
          ctx.query.filters = {
            ...ctx.query.filters,
            team: teams[0].id
          };
        }
      }
    }

    return await super.find(ctx);
  }
}));
