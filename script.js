// Data storage keys
const POSTS_KEY = 'techhandy_posts';
const REVIEWS_KEY = 'techhandy_reviews';
const CONTACT_KEY = 'techhandy_contact';
const VIDEOS_KEY = 'techhandy_videos';

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Get data from localStorage
function getStoredData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// Save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Initialize the main page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('review.html')) {
        return; // Don't initialize main page functions on review page
    }
    
    loadPosts();
    loadContactInfo();
    loadVideos();
    initializeEventListeners();
});

// Event listeners for main page
function initializeEventListeners() {
    // Add post form
    const addPostForm = document.getElementById('add-post-form');
    if (addPostForm) {
        addPostForm.addEventListener('submit', handleAddPost);
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleUpdateContact);
    }
}

// Handle adding new repair post
function handleAddPost(e) {
    e.preventDefault();
    
    const description = document.getElementById('post-description').value.trim();
    if (!description) return;

    const post = {
        id: generateId(),
        description: description,
        date: new Date().toISOString(),
        reviews: []
    };

    const posts = getStoredData(POSTS_KEY);
    posts.unshift(post);
    saveData(POSTS_KEY, posts);

    document.getElementById('post-description').value = '';
    loadPosts();
}

// Load and display posts
function loadPosts() {
    const posts = getStoredData(POSTS_KEY);
    const container = document.getElementById('posts-container');
    
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = '<p>No repair posts yet. Add your first post above!</p>';
        return;
    }

    container.innerHTML = posts.map(post => {
        const reviewLink = `${window.location.origin}/review.html?post=${post.id}`;
        const reviews = getStoredData(REVIEWS_KEY).filter(r => r.postId === post.id);
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 'No reviews';
        
        return `
            <div class="post">
                <div class="post-content">
                    <p>${post.description}</p>
                </div>
                <div class="post-meta">
                    <div>
                        <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                        ${reviews.length > 0 ? `<span class="post-rating"> | ⭐ ${avgRating} (${reviews.length} reviews)</span>` : ''}
                    </div>
                    <div>
                        <a href="${reviewLink}" class="review-link" target="_blank">Customer Review Link</a>
                        <button class="copy-link-btn" onclick="copyToClipboard('${reviewLink}')">Copy Link</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Copy link to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Review link copied to clipboard!');
    }).catch(() => {
        prompt('Copy this link:', text);
    });
}

// Handle contact info update
function handleUpdateContact(e) {
    e.preventDefault();

    const contact = {
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        serviceArea: document.getElementById('service-area').value,
        hours: document.getElementById('hours').value
    };

    saveData(CONTACT_KEY, contact);
    loadContactInfo();
    
    // Clear form
    document.getElementById('contact-form').reset();
    alert('Contact information updated!');
}

// Load contact information
function loadContactInfo() {
    const contact = getStoredData(CONTACT_KEY);
    if (!contact.phone) return;

    // Update displayed contact info
    const phoneLink = document.querySelector('.contact-info a[href^="tel:"]');
    const emailLink = document.querySelector('.contact-info a[href^="mailto:"]');
    const serviceAreaText = document.querySelector('.contact-info .contact-item:nth-child(3) p');
    const hoursText = document.querySelector('.contact-info .contact-item:nth-child(4) p');

    if (phoneLink && contact.phone) phoneLink.textContent = contact.phone;
    if (emailLink && contact.email) emailLink.textContent = contact.email;
    if (serviceAreaText && contact.serviceArea) serviceAreaText.textContent = contact.serviceArea;
    if (hoursText && contact.hours) hoursText.innerHTML = contact.hours.replace(/\n/g, '<br>');
}

// Update video
function updateVideo(videoNumber) {
    const urlInput = document.getElementById(`video${videoNumber}-url`);
    const container = document.getElementById(`video${videoNumber}-container`);
    const placeholder = document.querySelector(`.video-slot:nth-child(${videoNumber}) .video-placeholder`);
    
    const url = urlInput.value.trim();
    if (!url) return;

    let embedUrl = '';
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = extractYouTubeId(url);
        if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
    }
    // Vimeo
    else if (url.includes('vimeo.com')) {
        const videoId = extractVimeoId(url);
        if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
        }
    }

    if (embedUrl) {
        container.innerHTML = `
            <div class="video-container">
                <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
        placeholder.style.display = 'none';
        
        // Save video data
        const videos = getStoredData(VIDEOS_KEY);
        videos[videoNumber - 1] = { url, embedUrl };
        saveData(VIDEOS_KEY, videos);
    } else {
        alert('Please enter a valid YouTube or Vimeo URL');
    }
}

// Extract YouTube video ID
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Extract Vimeo video ID
function extractVimeoId(url) {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

// Load saved videos
function loadVideos() {
    const videos = getStoredData(VIDEOS_KEY);
    videos.forEach((video, index) => {
        if (video && video.embedUrl) {
            const videoNumber = index + 1;
            const container = document.getElementById(`video${videoNumber}-container`);
            const placeholder = document.querySelector(`.video-slot:nth-child(${videoNumber}) .video-placeholder`);
            const urlInput = document.getElementById(`video${videoNumber}-url`);
            
            if (container && placeholder && urlInput) {
                container.innerHTML = `
                    <div class="video-container">
                        <iframe src="${video.embedUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
                placeholder.style.display = 'none';
                urlInput.value = video.url;
            }
        }
    });
}

// Review page functionality
function initializeReviewPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');

    if (!postId) {
        showErrorMessage();
        return;
    }

    const posts = getStoredData(POSTS_KEY);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        showErrorMessage();
        return;
    }

    // Load repair details
    document.getElementById('repair-details').innerHTML = `
        <div class="post">
            <h3>Repair Details</h3>
            <div class="post-content">
                <p>${post.description}</p>
            </div>
            <div class="post-date">Completed on ${new Date(post.date).toLocaleDateString()}</div>
        </div>
    `;

    // Load existing reviews for this post
    loadReviewsForPost(postId);

    // Initialize star rating
    initializeStarRating();

    // Handle review form submission
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview(postId);
    });
}

// Initialize star rating functionality
function initializeStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            ratingInput.value = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#ffc107';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });

    document.querySelector('.stars').addEventListener('mouseleave', function() {
        const currentRating = parseInt(ratingInput.value) || 0;
        stars.forEach((s, index) => {
            if (index < currentRating) {
                s.style.color = '#ffc107';
            } else {
                s.style.color = '#ddd';
            }
        });
    });
}

// Submit review
function submitReview(postId) {
    const rating = parseInt(document.getElementById('rating').value);
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const comment = document.getElementById('comment').value.trim();

    if (!rating) {
        alert('Please select a rating');
        return;
    }

    const review = {
        id: generateId(),
        postId: postId,
        rating: rating,
        firstName: firstName,
        lastName: lastName,
        comment: comment,
        date: new Date().toISOString()
    };

    const reviews = getStoredData(REVIEWS_KEY);
    reviews.push(review);
    saveData(REVIEWS_KEY, reviews);

    showSuccessMessage();
}

// Load reviews for specific post
function loadReviewsForPost(postId) {
    const reviews = getStoredData(REVIEWS_KEY).filter(r => r.postId === postId);
    const container = document.getElementById('reviews-container');

    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet. Be the first to leave a review!</p>';
        return;
    }

    container.innerHTML = reviews.map(review => {
        const authorName = [review.firstName, review.lastName].filter(Boolean).join(' ') || 'Anonymous';
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        return `
            <div class="review">
                <div class="review-header">
                    <div>
                        <div class="review-author">${authorName}</div>
                        <div class="review-rating">${stars}</div>
                    </div>
                    <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                </div>
                ${review.comment ? `<div class="review-comment">${review.comment}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Show success message
function showSuccessMessage() {
    document.getElementById('review-form-container').classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');
}

// Show error message
function showErrorMessage() {
    document.getElementById('review-form-container').classList.add('hidden');
    document.getElementById('existing-reviews').classList.add('hidden');
    document.getElementById('error-message').classList.remove('hidden');
}