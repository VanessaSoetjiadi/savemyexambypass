// Android-compatible paywall remover
function removeBlurAndLimitWall() {
  try {
    console.log('📱 Android: Removing paywalls...');
    
    // 1. Remove blur from notes
    const notesBlur = document.querySelector('div.Wrapper_wrapper__GnBU0.mb-4.revision-notes_blur__iugNW');
    if (notesBlur) {
      notesBlur.classList.remove('revision-notes_blur__iugNW');
      console.log('✅ Removed notes blur');
    }

    // 2. Remove sign-up walls
    const limitWalls = document.querySelectorAll('div.LimitWall_signUpWrapper__num4B, div.limit-wall_wrapper__8cuMy');
    limitWalls.forEach(wall => {
      wall.remove();
      console.log('✅ Removed limit wall');
    });

    // 3. Remove question blur
    const questionsBlur = document.querySelector('div.Blur_blur__Q5tMa');
    if (questionsBlur) {
      questionsBlur.classList.remove('Blur_blur__Q5tMa');
      console.log('✅ Removed questions blur');
    }

    // 4. Android-specific: Remove mobile overlays and popups
    if (window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      // Remove mobile-specific paywalls
      const mobileWalls = document.querySelectorAll('div[class*="mobile"], div[class*="Mobile"], div[class*="popup"], div[class*="modal"]');
      mobileWalls.forEach(element => {
        if (element.textContent.match(/sign up|premium|limit|subscribe|upgrade/i)) {
          element.remove();
          console.log('✅ Removed mobile overlay');
        }
      });
      
      // Enable scrolling (often disabled on mobile paywalls)
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.body.style.position = 'static';
    }

    // 5. Remove any iframe paywalls
    const paywallIframes = document.querySelectorAll('iframe[src*="paywall"], iframe[src*="limit"]');
    paywallIframes.forEach(iframe => {
      iframe.remove();
      console.log('✅ Removed paywall iframe');
    });

  } catch (error) {
    console.error('Error removing elements:', error);
  }
}

// Android-optimized mutation observer
function setupMutationObserver() {
  const observer = new MutationObserver(function(mutations) {
    let shouldRun = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        // Check if added nodes contain paywall elements
        Array.from(mutation.addedNodes).forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (node.classList?.contains('revision-notes_blur__iugNW') ||
                node.classList?.contains('LimitWall_signUpWrapper__num4B') ||
                node.classList?.contains('Blur_blur__Q5tMa') ||
                node.classList?.contains('limit-wall_wrapper__8cuMy') ||
                node.querySelector('[class*="blur"], [class*="Blur"], [class*="LimitWall"]')) {
              shouldRun = true;
            }
          }
        });
      }
    });
    
    if (shouldRun) {
      // Use requestAnimationFrame for better Android performance
      requestAnimationFrame(() => {
        removeBlurAndLimitWall();
      });
    }
  });

  // Start observing with Android-optimized settings
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  return observer;
}

// Android-compatible initialization
function init() {
  console.log('📱 SaveMyExams Hack: Initializing on Android...');
  
  // Initial cleanup
  removeBlurAndLimitWall();
  
  // Set up mutation observer for dynamic content
  setupMutationObserver();
  
  // Additional cleanup after a short delay (for SPAs)
  setTimeout(removeBlurAndLimitWall, 2000);
  
  // Continuous cleanup for single-page apps
  setInterval(removeBlurAndLimitWall, 5000);
}

// Android-compatible event listeners
function setupEventListeners() {
  // DOMContentLoaded (for initial load)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Listen for history changes (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(init, 1000);
    }
  }).observe(document, { subtree: true, childList: true });
  
  // Listen for pushState/replaceState (SPA navigation)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    setTimeout(init, 500);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    setTimeout(init, 500);
  };
}

// Start everything
setupEventListeners();

// Export for potential external use (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { removeBlurAndLimitWall, init };
}