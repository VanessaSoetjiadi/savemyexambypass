function removeBlurAndLimitWall() {
  try {
    // Removing blur and limit wall sign up for notes
    const notesBlur = document.querySelector('div.Wrapper_wrapper__GnBU0.mb-4.revision-notes_blur__iugNW');
    if (notesBlur) {
      notesBlur.classList.remove('revision-notes_blur__iugNW');
      console.log('✅ Removed notes blur');
    }

    const limitWallNotes = document.querySelector('div.LimitWall_signUpWrapper__num4B');
    if (limitWallNotes) {
      limitWallNotes.remove();
      console.log('✅ Removed notes limit wall');
    }

    // Removing blur and limit wall sign up for questions
    const questionsBlur = document.querySelector('div.Blur_blur__Q5tMa');
    if (questionsBlur) {
      questionsBlur.classList.remove('Blur_blur__Q5tMa');
      console.log('✅ Removed questions blur');
    }

    const limitWallQuestions = document.querySelector('div.limit-wall_wrapper__8cuMy');
    if (limitWallQuestions) {
      limitWallQuestions.remove();
      console.log('✅ Removed questions limit wall');
    }

    // Mobile-specific: Remove any mobile paywalls or overlays
    if (window.innerWidth <= 768) {
      const mobileOverlays = document.querySelectorAll('div[class*="mobile"], div[class*="Mobile"], div[class*="Overlay"]');
      mobileOverlays.forEach(element => {
        if (element.textContent.includes('sign up') || element.textContent.includes('premium') || element.textContent.includes('limit')) {
          element.remove();
          console.log('✅ Removed mobile overlay');
        }
      });
    }

  } catch (error) {
    console.error('Error removing elements:', error);
  }
}

// Handle dynamic content with better performance
function observeAndRemoveElements() {
  removeBlurAndLimitWall();

  // Set up observer for dynamically loaded content (throttled for performance)
  const observer = new MutationObserver(function (mutations) {
    // Only run if relevant nodes were added
    const hasRelevantChanges = mutations.some(mutation =>
      mutation.addedNodes.length > 0 &&
      Array.from(mutation.addedNodes).some(node =>
        node.nodeType === 1 && // Element node
        (node.classList?.contains('revision-notes_blur__iugNW') ||
          node.classList?.contains('LimitWall_signUpWrapper__num4B') ||
          node.classList?.contains('Blur_blur__Q5tMa') ||
          node.classList?.contains('limit-wall_wrapper__8cuMy') ||
          node.querySelector('[class*="blur"], [class*="Blur"], [class*="LimitWall"]'))
      )
    );

    if (hasRelevantChanges) {
      // Debounce to avoid multiple rapid executions
      clearTimeout(window.savemyexamsDebounce);
      window.savemyexamsDebounce = setTimeout(removeBlurAndLimitWall, 150);
    }
  });

  // Start observing with optimized settings
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}

// Initialize with mobile compatibility
function init() {
  // Wait a bit longer for mobile pages to fully load
  const isMobile = window.innerWidth <= 768;
  const delay = isMobile ? 1000 : 100;

  setTimeout(observeAndRemoveElements, delay);
}

// Start when DOM is ready or page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Also listen for page transitions (common in mobile SPAs)
window.addEventListener('load', init);