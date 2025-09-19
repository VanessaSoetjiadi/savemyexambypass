// SaveMyExams Unlocker - Android Optimized
console.log('📱 SaveMyExams Unlocker loaded on Android');

function unlockContent() {
    try {
        // 1. Remove blur from revision notes
        const notesBlur = document.querySelector('.revision-notes_blur__iugNW');
        if (notesBlur) {
            notesBlur.classList.remove('revision-notes_blur__iugNW');
            console.log('✅ Removed notes blur');
        }

        // 2. Remove all limit walls and paywalls
        const paywallSelectors = [
            '.LimitWall_signUpWrapper__num4B',
            '.limit-wall_wrapper__8cuMy',
            '[class*="paywall"]',
            '[class*="Paywall"]',
            '[class*="limit"]',
            '[class*="Limit"]'
        ];

        paywallSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (element.textContent.includes('sign up') || 
                    element.textContent.includes('premium') || 
                    element.textContent.includes('limit')) {
                    element.remove();
                    console.log('✅ Removed paywall:', selector);
                }
            });
        });

        // 3. Remove question blur
        const questionBlur = document.querySelector('.Blur_blur__Q5tMa');
        if (questionBlur) {
            questionBlur.classList.remove('Blur_blur__Q5tMa');
            console.log('✅ Removed question blur');
        }

        // 4. Mobile-specific fixes for Samsung Fold
        if (window.innerWidth <= 768 || /Android/i.test(navigator.userAgent)) {
            // Enable scrolling if disabled
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            
            // Remove mobile overlays
            const mobileOverlays = document.querySelectorAll('[class*="mobile"], [class*="Mobile"], [class*="overlay"]');
            mobileOverlays.forEach(overlay => {
                if (overlay.textContent.match(/sign up|premium|subscribe/i)) {
                    overlay.remove();
                    console.log('✅ Removed mobile overlay');
                }
            });
        }

    } catch (error) {
        console.log('❌ Error in unlockContent:', error);
    }
}

// Simple and efficient mutation observer for Android
function setupContentObserver() {
    const observer = new MutationObserver(function(mutations) {
        let shouldRun = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldRun = true;
            }
        });
        
        if (shouldRun) {
            // Use timeout to avoid performance issues on mobile
            setTimeout(unlockContent, 100);
        }
    });

    // Lightweight observation for mobile performance
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize with mobile-friendly timing
function init() {
    // Initial unlock
    unlockContent();
    
    // Setup observer for dynamic content
    setupContentObserver();
    
    // Additional checks for single-page apps
    setTimeout(unlockContent, 1000);
    setTimeout(unlockContent, 3000);
}

// Mobile-optimized event handling
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // If already loaded, run immediately
    setTimeout(init, 100);
}

// Handle SPA navigation (common in modern sites)
let lastUrl = location.href;
new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        setTimeout(init, 500);
    }
}).observe(document, {subtree: true, childList: true});

// Continuous cleanup for stubborn paywalls (every 5 seconds)
setInterval(unlockContent, 5000);