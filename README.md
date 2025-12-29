# Dodgeball Champions Tour CMS

This is the Strapi CMS for managing team photo galleries for the Dodgeball Champions Tour website.

## Content Types

### Team
- **teamName** (String, required): Full team name
- **teamSlug** (UID, required): URL-friendly slug (auto-generated)
- **countryCode** (String, required): Country code (e.g., "USA", "MEX", "GBR")
- **galleryPhotos** (Media, multiple): Team photo gallery images

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

### Setting Up Teams

After deployment:
1. Log in to the admin panel
2. Go to Content Manager → Team
3. Create entries for each team with their gallery photos
4. Make sure to publish each entry

### API Permissions

Don't forget to set public read permissions:
1. Settings → Users & Permissions Plugin → Roles → Public
2. Enable `find` and `findOne` for the Team content type
