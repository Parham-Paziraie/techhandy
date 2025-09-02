// Data storage keys
const POSTS_KEY = 'techhandy_posts';
const REVIEWS_KEY = 'techhandy_reviews';
const OWNER_COMMENTS_KEY = 'techhandy_owner_comments';
const CONTACT_KEY = 'techhandy_contact';
const VIDEOS_KEY = 'techhandy_videos';
const ADMIN_KEY = 'techhandy_admin';

// Admin password (change this to your desired password)
const ADMIN_PASSWORD = 'techhandy123';

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
    checkAdminStatus();
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

    // Admin login modal events
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    const adminModal = document.getElementById('admin-modal');
    const closeModal = document.getElementById('close-modal');
    const adminLoginForm = document.getElementById('admin-login-form');

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', showAdminModal);
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', adminLogout);
    }

    if (closeModal) {
        closeModal.addEventListener('click', hideAdminModal);
    }

    if (adminModal) {
        adminModal.addEventListener('click', function(e) {
            if (e.target === adminModal) {
                hideAdminModal();
            }
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
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
        const commentLink = `${window.location.origin}/comment.html?post=${post.id}`;
        const reviews = getStoredData(REVIEWS_KEY).filter(r => r.postId === post.id);
        const ownerComments = getStoredData(OWNER_COMMENTS_KEY).filter(c => c.postId === post.id);
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
                        ${ownerComments.length > 0 ? `<span class="owner-comment-status"> | 💬 Owner comment</span>` : ''}
                    </div>
                    <div class="post-links">
                        <div class="link-section">
                            <label>Public Reviews (Stars):</label>
                            <a href="${reviewLink}" class="review-link" target="_blank">Review Link</a>
                            <button class="copy-link-btn" onclick="copyToClipboard('${reviewLink}')">Copy</button>
                        </div>
                        <div class="link-section">
                            <label>Owner Comment:</label>
                            <a href="${commentLink}" class="comment-link" target="_blank">Comment Link</a>
                            <button class="copy-link-btn" onclick="copyToClipboard('${commentLink}')">Copy</button>
                        </div>
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
        
        // Keep placeholder visible for admin users (don't hide it)
        // The admin-only class will control visibility based on login status
        
        // Save video data
        const videos = getStoredData(VIDEOS_KEY);
        videos[videoNumber - 1] = { url, embedUrl };
        saveData(VIDEOS_KEY, videos);
        
        alert('Video updated successfully!');
    } else {
        alert('Please enter a valid YouTube or Vimeo URL');
    }
}

// Remove video
function removeVideo(videoNumber) {
    if (!confirm('Are you sure you want to remove this video?')) {
        return;
    }
    
    const container = document.getElementById(`video${videoNumber}-container`);
    const urlInput = document.getElementById(`video${videoNumber}-url`);
    
    if (container && urlInput) {
        container.innerHTML = '';
        urlInput.value = '';
        
        // Remove from storage
        const videos = getStoredData(VIDEOS_KEY);
        videos[videoNumber - 1] = null;
        saveData(VIDEOS_KEY, videos);
        
        alert('Video removed successfully!');
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
                // Don't hide placeholder - let admin-only class control visibility
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
    const reviewerName = document.getElementById('reviewer-name').value.trim();

    if (!rating) {
        alert('Please select a rating');
        return;
    }

    const review = {
        id: generateId(),
        postId: postId,
        rating: rating,
        reviewerName: reviewerName,
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
        container.innerHTML = '<p>No ratings yet. Be the first to rate this repair!</p>';
        return;
    }

    container.innerHTML = reviews.map(review => {
        const authorName = review.reviewerName || 'Anonymous';
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

// Admin Authentication Functions
function checkAdminStatus() {
    const isLoggedIn = localStorage.getItem(ADMIN_KEY) === 'true';
    
    if (isLoggedIn) {
        showAdminElements();
    } else {
        hideAdminElements();
    }
}

function showAdminModal() {
    const modal = document.getElementById('admin-modal');
    const errorMessage = document.getElementById('login-error');
    
    if (modal) {
        modal.classList.add('show');
        modal.classList.remove('hidden');
        document.getElementById('admin-password').value = '';
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
    }
}

function hideAdminModal() {
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const password = document.getElementById('admin-password').value;
    const errorMessage = document.getElementById('login-error');
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_KEY, 'true');
        hideAdminModal();
        showAdminElements();
        alert('Successfully logged in as admin!');
    } else {
        if (errorMessage) {
            errorMessage.classList.remove('hidden');
        }
        document.getElementById('admin-password').value = '';
    }
}

function adminLogout() {
    localStorage.removeItem(ADMIN_KEY);
    hideAdminElements();
    alert('Logged out successfully!');
}

function showAdminElements() {
    // Show logout button, hide login button
    const loginBtn = document.getElementById('admin-login-btn');
    const logoutBtn = document.getElementById('admin-logout-btn');
    
    if (loginBtn) loginBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    
    // Show all admin-only elements
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(element => {
        element.classList.remove('hidden');
    });
    
    // Show admin panel
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.remove('hidden');
    }
}

function hideAdminElements() {
    // Hide logout button, show login button
    const loginBtn = document.getElementById('admin-login-btn');
    const logoutBtn = document.getElementById('admin-logout-btn');
    
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    
    // Hide all admin-only elements
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(element => {
        element.classList.add('hidden');
    });
    
    // Hide admin panel
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.add('hidden');
    }
}

// Owner Comment Page Functions
function initializeCommentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');

    if (!postId) {
        showCommentError();
        return;
    }

    const posts = getStoredData(POSTS_KEY);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        showCommentError();
        return;
    }

    // Check if owner comment already exists
    const ownerComments = getStoredData(OWNER_COMMENTS_KEY);
    const existingComment = ownerComments.find(c => c.postId === postId);

    if (existingComment) {
        showExistingComment(existingComment);
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

    // Load public reviews for this post
    loadPublicReviewsForComment(postId);

    // Handle comment form submission
    const commentForm = document.getElementById('owner-comment-form');
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitOwnerComment(postId);
    });
}

function submitOwnerComment(postId) {
    const ownerName = document.getElementById('owner-name').value.trim();
    const comment = document.getElementById('owner-comment').value.trim();

    if (!ownerName || !comment) {
        alert('Please fill in both your name and comment');
        return;
    }

    const ownerComment = {
        id: generateId(),
        postId: postId,
        ownerName: ownerName,
        comment: comment,
        date: new Date().toISOString()
    };

    const ownerComments = getStoredData(OWNER_COMMENTS_KEY);
    ownerComments.push(ownerComment);
    saveData(OWNER_COMMENTS_KEY, ownerComments);

    showCommentSuccess();
}

function showExistingComment(comment) {
    document.getElementById('comment-form-container').classList.add('hidden');
    document.getElementById('already-commented').classList.remove('hidden');
    
    document.getElementById('existing-owner-comment').innerHTML = `
        <div class="review">
            <div class="review-header">
                <div>
                    <div class="review-author">${comment.ownerName}</div>
                    <div class="review-date">${new Date(comment.date).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="review-comment">${comment.comment}</div>
        </div>
    `;
}

function loadPublicReviewsForComment(postId) {
    const reviews = getStoredData(REVIEWS_KEY).filter(r => r.postId === postId);
    const container = document.getElementById('reviews-container');

    if (reviews.length === 0) {
        container.innerHTML = '<p>No public ratings yet.</p>';
        return;
    }

    container.innerHTML = reviews.map(review => {
        const authorName = review.reviewerName || 'Anonymous';
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
            </div>
        `;
    }).join('');
}

function showCommentSuccess() {
    document.getElementById('comment-form-container').classList.add('hidden');
    document.getElementById('success-message').classList.remove('hidden');
}

function showCommentError() {
    document.getElementById('comment-form-container').classList.add('hidden');
    document.getElementById('existing-reviews').classList.add('hidden');
    document.getElementById('error-message').classList.remove('hidden');
}