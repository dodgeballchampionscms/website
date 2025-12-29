# Team Permissions Setup Guide

This guide shows how to configure Strapi so each team can only manage their own albums and photos.

## Overview

We'll create:
1. **Admin Role**: You - full access to everything
2. **Team Manager Role**: Each team gets a user account with restricted access to only their team's albums

## Step-by-Step Setup

### 1. Create Team Manager Role

After deployment, log in as admin:

1. Go to **Settings → Users & Permissions Plugin → Roles**
2. Click **Add new role**
3. Name: `Team Manager`
4. Description: `Can manage albums for their assigned team`

### 2. Configure Team Manager Permissions

In the Team Manager role settings:

#### Team Permissions:
- **Team**:
  - ✅ `find` (can see teams list)
  - ✅ `findOne` (can see their team details)
  - ❌ `create` (cannot create teams)
  - ❌ `update` (cannot edit team info)
  - ❌ `delete` (cannot delete teams)

#### Album Permissions:
- **Album**:
  - ✅ `find` (can see albums)
  - ✅ `findOne` (can see album details)
  - ✅ `create` (can create new albums)
  - ✅ `update` (can edit albums)
  - ✅ `delete` (can delete albums)

#### Upload Permissions (for photos):
- **Upload**:
  - ✅ `upload` (can upload photos)
  - ✅ `destroy` (can delete photos)

4. Click **Save**

### 3. Create User Accounts for Each Team

For each of the 8 teams:

1. Go to **Settings → Users & Permissions Plugin → Users**
2. Click **Add new user**
3. Fill in:
   - **Username**: `boston-anarchy` (use team slug)
   - **Email**: `anarchy@example.com` (team's email)
   - **Password**: Generate a strong password
   - **Confirmed**: ✅ Check this
   - **Blocked**: ❌ Leave unchecked
   - **Role**: Select `Team Manager`
4. Click **Save**
5. **Important**: Share the username and password with the team securely

Repeat for all 8 teams:
- `boston-anarchy`
- `lobos-mexico`
- `leamington-spartans`
- `london-storm`
- `paris-licorne`
- `phoenix-hex`
- `vienna-ninjas`
- `vienna-nutcrackers`

### 4. Add Custom Middleware to Restrict Access

**IMPORTANT**: By default, Team Managers can see ALL albums. We need to add a custom policy to restrict them to only their team's albums.

Create this file in your Strapi project:

**File**: `src/api/album/policies/is-team-owner.js`

```javascript
module.exports = async (policyContext, config, { strapi }) => {
  const { user } = policyContext.state;

  // Admin can do everything
  if (user.role.type === 'admin') {
    return true;
  }

  // Get the team associated with this user
  // We'll store this in a custom field on the user
  const userTeamSlug = user.teamSlug;

  if (!userTeamSlug) {
    return false; // User has no team assigned
  }

  // For create operations
  if (policyContext.request.method === 'POST') {
    const { team } = policyContext.request.body.data;

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
```

**File**: `src/api/album/routes/album.js`

```javascript
'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::album.album', {
  config: {
    find: {
      policies: ['is-team-owner']
    },
    findOne: {
      policies: ['is-team-owner']
    },
    create: {
      policies: ['is-team-owner']
    },
    update: {
      policies: ['is-team-owner']
    },
    delete: {
      policies: ['is-team-owner']
    }
  }
});
```

**File**: `src/api/album/controllers/album.js`

```javascript
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::album.album', ({ strapi }) => ({
  async find(ctx) {
    const { user } = ctx.state;

    // If admin, show all albums
    if (user.role.type === 'admin') {
      return await super.find(ctx);
    }

    // If Team Manager, filter by their team
    if (user.teamSlug) {
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

    return await super.find(ctx);
  }
}));
```

### 5. Add Custom Field to User Model

We need to add a `teamSlug` field to users so we can link them to their team.

**File**: `src/extensions/users-permissions/content-types/user/schema.json`

```json
{
  "kind": "collectionType",
  "collectionName": "up_users",
  "info": {
    "name": "user",
    "description": "",
    "singularName": "user",
    "pluralName": "users",
    "displayName": "User"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "username": {
      "type": "string",
      "minLength": 3,
      "unique": true,
      "configurable": false,
      "required": true
    },
    "email": {
      "type": "email",
      "minLength": 6,
      "configurable": false,
      "required": true
    },
    "provider": {
      "type": "string",
      "configurable": false
    },
    "password": {
      "type": "password",
      "minLength": 6,
      "configurable": false,
      "private": true,
      "searchable": false
    },
    "resetPasswordToken": {
      "type": "string",
      "configurable": false,
      "private": true,
      "searchable": false
    },
    "confirmationToken": {
      "type": "string",
      "configurable": false,
      "private": true,
      "searchable": false
    },
    "confirmed": {
      "type": "boolean",
      "default": false,
      "configurable": false
    },
    "blocked": {
      "type": "boolean",
      "default": false,
      "configurable": false
    },
    "role": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "plugin::users-permissions.role",
      "inversedBy": "users",
      "configurable": false
    },
    "teamSlug": {
      "type": "string",
      "required": false
    }
  }
}
```

### 6. Assign Teams to Users

After creating the custom field:

1. Go to **Settings → Users & Permissions Plugin → Users**
2. Edit each team user
3. Set the **teamSlug** field to match their team:
   - User `boston-anarchy` → teamSlug: `boston-anarchy`
   - User `lobos-mexico` → teamSlug: `lobos-mexico`
   - etc.
4. Save each user

## Testing

### Test as Team Manager:

1. Log out from admin
2. Log in as `boston-anarchy` user
3. Try to:
   - ✅ Create an album for Boston Anarchy → Should work
   - ✅ View Boston Anarchy's albums → Should work
   - ✅ Edit Boston Anarchy's albums → Should work
   - ❌ Create an album for a different team → Should fail
   - ❌ View another team's albums → Should not appear in list
   - ❌ Edit another team's albums → Should fail

## Public API Access

For your website to display albums publicly:

1. Go to **Settings → Users & Permissions Plugin → Roles → Public**
2. Enable:
   - **Team**: `find`, `findOne`
   - **Album**: `find`, `findOne`
   - **Upload**: `find` (to display images)

This allows your website to fetch and display all teams and albums without authentication.

## Summary

- **Admin users**: Full access to everything
- **Team Manager users**: Can only create/edit albums for their assigned team
- **Public (website visitors)**: Can view all teams and albums (read-only)
