        // Modal functionality
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImage");
        const images = document.querySelectorAll(".modal-image");

        images.forEach(img => {
            img.onclick = function() {
                modal.style.display = "flex";
                modalImg.src = this.src;
                modalImg.style.width = "auto"; // Ensure image is displayed in original size
                modalImg.style.height = "auto"; // Ensure image is displayed in original size
            }
        });

        const span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            modal.style.display = "none";
        }

        // Close modal when clicking outside the image
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }