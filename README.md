# TechHandy - Device Repair Business Website

A free static website for on-site device repair businesses with customer review functionality.

## Features

- **Repair Posts**: Add and display device repair work with descriptions
- **Customer Reviews**: Shareable links for customers to leave 1-5 star ratings with optional comments
- **Video Gallery**: Display up to 3 timelapse repair videos (YouTube/Vimeo)
- **Contact Information**: Editable business contact details
- **Mobile Responsive**: Works on all devices
- **No Backend Required**: Uses localStorage for data persistence

## Files Structure

```
├── index.html      # Main homepage
├── review.html     # Customer review page
├── style.css       # All styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## How It Works

1. **Add Repair Posts**: Use the admin panel on the homepage to add repair descriptions
2. **Share Review Links**: Each post generates a unique review link like `yoursite.com/review.html?post=abc123`
3. **Customer Reviews**: Customers use the link to leave ratings and comments
4. **Video Management**: Add YouTube or Vimeo URLs to display timelapse videos
5. **Contact Updates**: Edit your business information directly on the site

## Deployment to Render

### Step 1: Prepare Your Files
1. Ensure all files are in the same directory
2. Update the contact information in the HTML or use the contact form after deployment

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and create a free account
2. Click "New" → "Static Site"
3. Connect your GitHub repository (or upload files directly)
4. Configure the deployment:
   - **Build Command**: Leave empty (no build needed)
   - **Publish Directory**: `.` (current directory)
5. Click "Create Static Site"

### Step 3: Post-Deployment Setup
1. Visit your new site URL
2. Add your first repair post using the admin panel
3. Update your contact information using the contact form
4. Add your timelapse videos using YouTube/Vimeo URLs
5. Test the review functionality by clicking on a review link

## Usage Instructions

### Adding Repair Posts
1. Scroll to "Recent Repairs" section
2. Use the "Add New Repair Post" form
3. Enter a description of the repair work
4. Click "Add Post"
5. Share the generated review link with your customer

### Managing Videos
1. Go to "Repair Timelapses" section
2. Enter a YouTube or Vimeo URL in the video slot
3. Click "Update Video"
4. The video will embed automatically

### Updating Contact Info
1. Scroll to "Contact Information" section
2. Use the "Edit Contact Info" form
3. Fill in your business details
4. Click "Update Contact Info"

## Customer Review Process

1. Customer receives review link from you
2. Customer visits the link and sees repair details
3. Customer selects 1-5 stars (required)
4. Customer optionally adds name and comment
5. Review is saved and displayed on the review page

## Data Storage

All data is stored in the browser's localStorage:
- **Repair posts** with descriptions and dates
- **Customer reviews** with ratings and comments
- **Contact information** for your business
- **Video URLs** for the timelapse gallery

**Note**: Data is stored locally in each visitor's browser. For a shared admin experience across devices, consider upgrading to a backend solution in the future.

## Customization

### Changing Colors
Edit the CSS variables in `style.css`:
```css
/* Change the primary color from purple to your preferred color */
background: linear-gradient(135deg, #your-color 0%, #another-color 100%);
```

### Adding More Video Slots
1. Add new video slot HTML in `index.html`
2. Add corresponding CSS if needed
3. Update JavaScript to handle additional videos

### Business Branding
1. Change "TechHandy" to your business name in both HTML files
2. Update the page titles and descriptions
3. Add your logo by replacing the text header with an image

## Troubleshooting

### Reviews Not Showing
- Reviews are stored in localStorage and only visible in the same browser
- Clear browser data will reset all reviews
- For persistent reviews across devices, consider using a database solution

### Videos Not Loading
- Ensure URLs are from YouTube or Vimeo
- Check that videos are public and embeddable
- Use share URLs, not direct page URLs

### Mobile Issues
- The site is responsive but test on actual devices
- Ensure buttons and forms are easily tappable
- Check that text is readable on small screens

## Support

This is a free, open-source solution. For advanced features like:
- Persistent data across devices
- Email notifications for reviews
- Analytics and reporting
- Custom domains with SSL

Consider upgrading to a hosted solution with a backend database.

## License

Free to use and modify for your business needs.