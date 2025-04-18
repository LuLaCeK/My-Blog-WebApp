// CosmosDB Realtime Database configuration
        // Replace with your own CosmosDB project details
                
        // DOM Elements
        const nameInput = document.getElementById('name-input');
        const commentInput = document.getElementById('comment-input');
        const submitBtn = document.getElementById('submit-comment');
        const commentsContainer = document.getElementById('comments-container');
        const loadingElement = document.getElementById('loading');
        const errorMessage = document.getElementById('error-message');
      
     
        // Submit a new comment
        submitBtn.addEventListener('click', async (e) => {
            const name = nameInput.value.trim();
            const commentText = commentInput.value.trim();
            errorMessage.textContent = '';
            
    //reCapcthca
    e.preventDefault();
    grecaptcha.ready(function() {
        // Your reCAPTCHA code here
        grecaptcha.execute('6LeWDR0rAAAAAOnwVttwP0-12lluELJP4RrqdX0r', {action: 'submit'}).then(function(token) {
            // Token received
            console.log("reCAPTCHA token:", token);
            
            // Display score (for demo purposes - you wouldn't normally show this)
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
            
            const response = fetch('https://myblog-test-apims-euw-01.azure-api.net/api/v1.0/HttpTrigger', {
              method: 'POST',
              headers: {'ocp-apim-subscription-key': 'e61d13780ee34ed89c7f6f2c552fcb8d',
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
        });

 

      });
                       
        // Fetch comments from CosmosDB using REST API
        async function fetchComments() {
            try {
                // Add orderBy and limitToLast parameters for sorting and limiting
                const response = await fetch('https://myblog-test-apims-euw-01.azure-api.net/api/v1.0/HttpTrigger', {
                  method: 'GET',
                  headers: {'ocp-apim-subscription-key': 'e61d13780ee34ed89c7f6f2c552fcb8d',
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
        function displayComments(commentsData) {
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
                
                // Add delete functionality
                const deleteBtn = commentElement.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    deleteComment(comment.id);
                });
                
                commentsContainer.appendChild(commentElement);
            });
        }
        
        // Delete a comment
        async function deleteComment(commentId) {
            if (confirm('Are you sure you want to delete this comment?')) {
                try {
                    const response = await fetch(`${FIREBASE_DATABASE_URL}/comments/${commentId}.json`, {
                        method: 'DELETE'
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to delete');
                    }
                    
                    // Refresh comments after deletion
                    fetchComments();
                } catch (error) {
                    console.error('Error deleting comment:', error);
                    alert('Failed to delete comment. Please try again.');
                }
            }
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
        
        // Start polling when the page loads
        document.addEventListener('DOMContentLoaded', fetchComments);