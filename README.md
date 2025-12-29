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
- **photographerCredit** (String, optional): Default photographer credit for all photos in album
- **photos** (Component, repeatable): Collection of photos with individual metadata

### Photo Item (Component)
- **image** (Media, required): The photo file
- **photographerCredit** (String, optional): Individual photo credit (overrides album credit)
- **caption** (Text, optional): Photo caption or description

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
3. **Create Albums**:
   - Go to Content Manager → Album
   - Create a new album, select the team it belongs to
   - Add title, date, location, and photographer credit
   - Click "Add component" to add photos
   - For each photo: upload image, optionally add individual photographer credit or caption
   - Publish the album
4. **Bulk Upload Workflow**:
   - Create the album with metadata
   - Click "Add component" for each photo you want to upload
   - Upload multiple images at once in the media library
   - Assign photographer credits afterward if different from album default

### API Permissions

Don't forget to set public read permissions:
1. Settings → Users & Permissions Plugin → Roles → Public
2. Enable `find` and `findOne` for both **Team** and **Album** content types
