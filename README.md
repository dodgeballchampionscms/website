# Dodgeball Champions Tour CMS

This is the Strapi CMS for managing team photo galleries for the Dodgeball Champions Tour website.

## Content Types

### Team
- **teamName** (String, required): Full team name
- **teamSlug** (UID, required): URL-friendly slug (auto-generated)
- **countryCode** (String, required): Country code (e.g., "USA", "MEX", "GBR")
- **albums** (Relation): Has many Albums

### Album
- **title** (String, required): Album title (e.g., "Training Session", "Tournament Finals")
- **team** (Relation, required): Belongs to Team
- **eventDate** (Date, optional): Date of the event
- **location** (String, optional): Location of the event
- **photographerCredit** (String, optional): Photographer credit for the entire album
- **photos** (Media, multiple): Bulk upload photos (drag and drop multiple files)
- **photoMetadata** (JSON, optional): Optional individual photo credits/captions stored as JSON

## Deployment

This project is designed to be deployed to Strapi Cloud.

### Deploy to Strapi Cloud:

1. Push this repository to GitHub
2. Log in to [Strapi Cloud](https://cloud.strapi.io)
3. Create new project → "Deploy from GitHub"
4. Select this repository
5. Strapi Cloud will automatically detect the configuration

### API Access

Once deployed, you'll have access to:
- Admin panel: `https://your-project.strapiapp.com/admin`
- API endpoint: `https://your-project.strapiapp.com/api/teams`

### Setting Up Content

After deployment:
1. Log in to the admin panel
2. **Create Teams**:
   - Go to Content Manager → Team
   - Create entries for all 8 teams
   - Publish each team
3. **Create Albums with Bulk Photo Upload**:
   - Go to Content Manager → Album → Create new entry
   - Select the team this album belongs to
   - Add album title (required)
   - Optionally add: event date, location, photographer credit
   - **Bulk Upload Photos**: Click on the "photos" field and drag/drop multiple images at once
   - Click Publish

4. **Optional: Add Individual Photo Metadata** (for teams with resources):
   - After creating the album, teams can optionally add individual credits/captions
   - Edit the album → scroll to "photoMetadata" JSON field
   - Add custom metadata in JSON format (we'll provide a UI for this later if needed)
   - For most teams: just bulk upload and use the album-level photographer credit

### API Permissions

Don't forget to set public read permissions:
1. Settings → Users & Permissions Plugin → Roles → Public
2. Enable `find` and `findOne` for both **Team** and **Album** content types
