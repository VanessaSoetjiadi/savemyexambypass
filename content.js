// SaveMyExams Paywall Remover - Android & Desktop Compatible
function removeBlurAndLimitWall() {
  try {
    // 1. Remove blur from notes
    const notesBlur = document.querySelector('div.Wrapper_wrapper__GnBU0.mb-4.revision-notes_blur__iugNW');
    if (notesBlur) {
      notesBlur.classList.remove('revision-notes_blur__iugNW');
    }

    // 2. Remove sign-up walls
    const limitWalls = document.querySelectorAll('div.LimitWall_signUpWrapper__num4B, div.limit-wall_wrapper__8cuMy');
    limitWalls.forEach(wall => wall.remove());

    // 3. Remove question blur
    const questionsBlur = document.querySelector('div.Blur_blur__Q5tMa');
    if (questionsBlur) {
      questionsBlur.classList.remove('Blur_blur__Q5tMa');
    }

    // 4. Mobile-specific cleanup
    if (window.innerWidth <= 768) {
      const mobileWalls = document.querySelectorAll('div[class*="mobile"], div[class*="Mobile"]');
      mobileWalls.forEach(element => {
        if (element.textContent.match(/sign up|premium|limit/i)) {
          element.remove();
        }
      });
    }

  } catch (error) {
    console.error('SaveMyExams Hack Error:', error);
  }
}

// Simple mutation observer for dynamic content
function setupObserver() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        removeBlurAndLimitWall();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize
function init() {
  removeBlurAndLimitWall();
  setupObserver();
  
  // Re-check periodically for SPAs
  setInterval(removeBlurAndLimitWall, 3000);
}

// Start when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}