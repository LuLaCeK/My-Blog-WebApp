// DOM Elements
const nameInput = document.getElementById('name-input');
const commentInput = document.getElementById('comment-input');
const submitBtn = document.getElementById('submit-comment');
const errorMessage = document.getElementById('error-message');

//Import functions from other modules
import { fetchComments } from './getComments.js';


// Submit a new comment
export function setupCommentSubmission() {
    submitBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const commentText = commentInput.value.trim();
        errorMessage.textContent = '';
        
        // Validate inputs
        if (!name) {
            errorMessage.textContent = 'Please enter your name';
            return;
        }
        if (!commentText) {
            errorMessage.textContent = 'Please enter a comment';
            return;
        }
        
        try {
            // Disable the button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Posting...';
            
            // Add comment to CosmosDB using REST API
            const newComment = {
                username: name,
                content: commentText,
                //timestamp: Date.now()
            };
            
            const response = await fetch('https://myblog-test-apims-euw-01.azure-api.net/api/v1.0/HttpTrigger', {
                method: 'POST',
                headers: {
                    'ocp-apim-subscription-key': 'e61d13780ee34ed89c7f6f2c552fcb8d',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(newComment)
            });
            
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }
            
            // Clear form
            nameInput.value = '';
            commentInput.value = '';
            
            // Refresh comments immediately
            fetchComments();

        } catch (error) {
            console.error('Error adding comment:', error);
            errorMessage.textContent = 'Failed to post comment. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Comment';
        }
    });
}