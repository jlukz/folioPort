document.querySelectorAll('.hoverable').forEach(el => {
  const preview = document.createElement('div');
  preview.className = 'hover-preview';
  document.body.appendChild(preview);

  // Variable to store the interval ID for THIS specific preview element (for slideshow)
  let slideshowInterval = null;

  // Create a video element once per preview div
  const video = document.createElement('video');
  video.loop = true;  // Video will loop continuously
  video.muted = true; // Video will play silently (crucial for autoplay in many browsers)
  video.preload = 'auto'; // Helps with faster loading
  video.style.width = '100%'; // Make video fill the preview div
  video.style.height = '100%';
  video.style.objectFit = 'cover'; // Ensures video covers the area without distortion
  video.style.display = 'none'; // Initially hidden
  preview.appendChild(video); // Add the video element to the preview div

  el.addEventListener('mouseenter', () => {
    const singleMediaPath = el.dataset.img;   // For single image or video
    const multipleMediaPaths = el.dataset.imgs; // For multiple images (slideshow)

    // Clear any existing slideshow interval for this preview
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }

    // Hide video element and clear its source by default for new hover events
    video.style.display = 'none';
    video.pause();
    video.removeAttribute('src'); // Good for cleanup

    // Clear any previous background image style
    preview.style.backgroundImage = 'none';
    preview.style.backgroundSize = 'cover'; // Reset to default
    preview.style.backgroundPosition = 'center'; // Reset to default

    if (multipleMediaPaths) { // Case 1: Multiple images (slideshow)
      const images = multipleMediaPaths.split(',').map(path => path.trim()); // Split and clean
      let currentIndex = 0;

      const updateSlideshowImage = () => {
        if (images.length > 0) { // Ensure there are images to show
          preview.style.backgroundImage = `url(${images[currentIndex]})`;
          currentIndex = (currentIndex + 1) % images.length;
        }
      };

      preview.style.display = 'block'; // Show the preview container
      updateSlideshowImage(); // Show the first image immediately
      // Set interval for slideshow, e.g., every 2 seconds
      if (images.length > 1) { // Only start slideshow if more than one image
        slideshowInterval = setInterval(updateSlideshowImage, 500); // Change every 2 seconds
      }

    } else if (singleMediaPath) { // Case 2: Single image or video
      if (singleMediaPath.endsWith('.mp4') || singleMediaPath.endsWith('.webm') || singleMediaPath.endsWith('.ogg')) {
        // It's a video
        video.src = singleMediaPath;
        video.style.display = 'block'; // Show video element
        preview.style.display = 'block'; // Show container
        video.play().catch(error => {
          console.warn("Video autoplay prevented:", error);
        });
      } else {
        // It's a single image
        preview.style.backgroundImage = `url(${singleMediaPath})`;
        preview.style.display = 'block';
      }
    } else {
      // No data-img or data-imgs specified, hide preview
      preview.style.display = 'none';
    }
  });

  el.addEventListener('mouseleave', () => {
    preview.style.display = 'none';
    // Clear the slideshow interval when mouse leaves
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
    // Pause and reset video if it was playing
    if (video.src) { // Check if video source is set to avoid errors
      video.pause();
      video.currentTime = 0;
      video.removeAttribute('src'); // Clean up video source
    }
    preview.style.backgroundImage = 'none'; // Clear background image when hidden
  });
});
