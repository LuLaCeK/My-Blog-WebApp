// CosmosDB Realtime Database configuration
// Replace with your own CosmosDB project details

// DOM Elements
const commentsContainer = document.getElementById('comments-container');
const loadingElement = document.getElementById('loading');

// Fetch comments from CosmosDB using REST API
export async function fetchComments() {
    try {
        const response = await fetch('https://myblog-test-apims-euw-01.azure-api.net/api/v2.0/HttpTrigger', {
            method: 'GET',
            headers: {
                'ocp-apim-subscription-key': 'e61d13780ee34ed89c7f6f2c552fcb8d',
                'content-type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        loadingElement.style.display = 'none';
        displayComments(data);
        
    } catch (error) {
        loadingElement.style.display = 'none';
        console.error('Error fetching comments:', error);
        commentsContainer.innerHTML = '<p>Error loading comments. Please refresh the page.</p>';
    }
}

// Display comments on the page
export function displayComments(commentsData) {
    commentsContainer.innerHTML = '';
    
    if (!commentsData) {
        commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }
    
    // Convert object to array and sort by timestamp (newest first)
    const commentsArray = Object.entries(commentsData).map(([id, comment]) => {
        return { id, ...comment };
    }).sort((a, b) => b.timestamp - a.timestamp);
    
    if (commentsArray.length === 0) {
        commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }
    
    commentsArray.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.dataset.id = comment.id;
        
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="author">${escapeHtml(comment.username)}</span>
                <span class="timestamp">${formatDate(comment.timestamp)}</span>
            </div>
            <div class="comment-text">${escapeHtml(comment.content)}</div>
            <button class="delete-btn">Delete</button>
        `;
        
        commentsContainer.appendChild(commentElement);
    });
}

// Helper function to format dates
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
}

// Helper function to prevent XSS attacks
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}