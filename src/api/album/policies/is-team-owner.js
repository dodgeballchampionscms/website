'use strict';

/**
 * `is-team-owner` policy
 * Ensures users can only access albums for their assigned team
 */

module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;

  // Admin can do everything
  if (user && user.role && user.role.type === 'authenticated') {
    // Check if user is an admin (you'll need to check role name or type)
    const role = await strapi.query('plugin::users-permissions.role').findOne({
      where: { id: user.role.id }
    });

    if (role && role.type === 'admin') {
      return true;
    }
  }

  // Get the team associated with this user
  const userTeamSlug = user.teamSlug;

  if (!userTeamSlug) {
    return false; // User has no team assigned
  }

  // For create operations
  if (policyContext.request.method === 'POST') {
    const { team } = policyContext.request.body.data;

    if (!team) {
      return false;
    }

    // Find the team by ID
    const teamData = await strapi.entityService.findOne('api::team.team', team);

    // Check if user's team matches the album's team
    return teamData && teamData.teamSlug === userTeamSlug;
  }

  // For update/delete operations
  if (policyContext.request.method === 'PUT' || policyContext.request.method === 'DELETE') {
    const { id } = policyContext.params;

    // Find the album with its team
    const album = await strapi.entityService.findOne('api::album.album', id, {
      populate: ['team']
    });

    if (!album) {
      return false;
    }

    // Check if user's team matches the album's team
    return album.team && album.team.teamSlug === userTeamSlug;
  }

  // For find operations - we'll filter in the controller
  return true;
};
