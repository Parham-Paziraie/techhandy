# TechHandy - Device Repair Business Website

A free static website for on-site device repair businesses with customer review functionality.

## Features

- **Admin-Protected Repair Posts**: Add and display device repair work with descriptions (admin login required)
- **Dual Link System**: Generate separate links for public ratings and owner comments
- **Public Star Ratings**: Anyone can leave 1-5 star ratings via public review links
- **Owner-Only Comments**: Device owners get special links to leave one detailed comment
- **Replaceable Video Gallery**: Display up to 3 timelapse repair videos with easy replacement
- **Contact Information**: Editable business contact details (admin only)
- **Mobile Responsive**: Works on all devices
- **No Backend Required**: Uses localStorage for data persistence

## Files Structure

```
├── index.html      # Main homepage
├── review.html     # Public star rating page
├── comment.html    # Owner comment page
├── style.css       # All styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## How It Works

1. **Admin Login**: Click "Admin Login" and enter password `techhandy123` to access admin features
2. **Add Repair Posts**: Use the admin panel to add repair descriptions (admin only)
3. **Dual Link Generation**: Each post generates TWO shareable links:
   - **Public Review Link**: `yoursite.com/review.html?post=abc123` (for star ratings)
   - **Owner Comment Link**: `yoursite.com/comment.html?post=abc123` (for device owner comments)
4. **Public Ratings**: Anyone can leave 1-5 star ratings using the public review link
5. **Owner Comments**: Device owners use the special comment link to leave ONE detailed comment
6. **Video Management**: Add/replace/remove YouTube or Vimeo videos anytime (admin only)
7. **Contact Updates**: Edit your business information directly on the site (admin only)

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
2. Click "Admin Login" and enter password: `techhandy123`
3. Add your first repair post using the admin panel
4. Update your contact information using the contact form
5. Add your timelapse videos using YouTube/Vimeo URLs
6. Test the review functionality by clicking on a review link

**IMPORTANT**: Change the admin password by editing line 9 in `script.js` before deploying!

## Usage Instructions

### Adding Repair Posts
1. Login as admin first
2. Scroll to "Recent Repairs" section
3. Use the "Add New Repair Post" form
4. Enter a description of the repair work
5. Click "Add Post"
6. Share BOTH generated links:
   - **Public Review Link**: For anyone to leave star ratings
   - **Owner Comment Link**: Give this to the device owner for detailed comments

### Managing Videos (Admin Only)
1. Login as admin first
2. Go to "Repair Timelapses" section
3. Enter a YouTube or Vimeo URL in the video slot
4. Click "Update Video" to embed or replace existing video
5. Click "Remove Video" to delete a video
6. Video controls remain visible for easy management

### Updating Contact Info (Admin Only)
1. Login as admin first
2. Scroll to "Contact Information" section
3. Use the "Edit Contact Info" form
4. Fill in your business details
5. Click "Update Contact Info"

## Customer Feedback Process

### Public Star Ratings
1. Anyone receives the public review link from you
2. Visitor selects 1-5 stars and optionally adds their name
3. Rating is saved and displayed publicly

### Owner Comments  
1. Device owner receives the special comment link from you
2. Owner visits link and sees repair details
3. Owner enters their name and detailed comment (both required)
4. Only ONE comment allowed per owner link
5. Comment is saved and displayed on the post

## Data Storage

All data is stored in the browser's localStorage:
- **Repair posts** with descriptions and dates
- **Public star ratings** with names and ratings
- **Owner comments** with names and detailed feedback (one per post)
- **Contact information** for your business
- **Video URLs** for the timelapse gallery
- **Admin login status** (persistent until logout)

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