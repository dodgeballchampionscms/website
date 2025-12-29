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
- **defaultPhotographerCredit** (String, optional): Default photographer credit for all photos in album
- **photos** (Media, multiple): Bulk upload photos (drag and drop multiple files)
- **photoCredits** (Component, repeatable): Optional individual photo credits that override the default

### Photo Credit (Component)
- **photoFilename** (String, required): Name of the photo file (e.g., "IMG_1234.jpg")
- **photographerName** (String, optional): Photographer credit for this specific photo
- **caption** (Text, optional): Caption or description for this photo

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
   - Optionally add: event date, location
   - **Add Default Photographer Credit**: Enter photographer name (applies to all photos)
   - **Bulk Upload Photos**: Click on the "photos" field and drag/drop multiple images at once
   - Click Publish

4. **Optional: Add Individual Photo Credits** (only if specific photos need different credits):
   - Edit the album
   - Scroll to "Photo Credits" section
   - Click "+ Add component"
   - Fill in the simple form:
     - **Photo Filename**: Type the filename you see (e.g., "IMG_1234.jpg")
     - **Photographer Name**: Override the default photographer for this photo
     - **Caption**: Add an optional caption
   - Click "+ Add component" again for each photo that needs individual credit
   - Save and Publish
   - **Note**: Most teams will skip this step and just use the default photographer credit

### Team-Based Access Control

**IMPORTANT**: To restrict teams so they can only manage their own albums, see the detailed guide:

📖 **[TEAM_PERMISSIONS_GUIDE.md](TEAM_PERMISSIONS_GUIDE.md)**

This guide covers:
- Creating Team Manager role with limited permissions
- Creating user accounts for each team
- Restricting album access to only the team's own albums
- Custom policies and middleware (already included in this repo)

### Public API Permissions

For your website to display albums publicly:

1. Settings → Users & Permissions Plugin → Roles → Public
2. Enable `find` and `findOne` for both **Team** and **Album** content types
