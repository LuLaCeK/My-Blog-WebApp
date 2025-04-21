// Delete a comment
export function setupDeleteHandlers() {
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const commentElement = event.target.closest('.comment');
            const commentId = commentElement.dataset.id;
            
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
    });
}