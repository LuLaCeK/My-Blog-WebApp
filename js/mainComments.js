import { fetchComments, displayComments } from './getComments.js';
import { setupCommentSubmission } from './addComments.js';
import { setupDeleteHandlers } from './deleteComments.js';

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchComments();
    setupCommentSubmission();
    setupDeleteHandlers();
});