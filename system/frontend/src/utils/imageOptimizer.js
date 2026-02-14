/**
 * Image optimization utilities for lazy loading and responsive images
 */

// Default placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

/**
 * Creates a responsive image source set string
 * @param {string} baseUrl - The base URL of the image
 * @param {Object} options - Configuration options
 * @param {number[]} [options.widths=[320, 640, 1024, 1280, 1920]] - Array of image widths to generate
 * @param {string} [options.extension='webp'] - Image extension to use
 * @returns {string} - A srcset string
 */
export function createSrcSet(baseUrl, options = {}) {
  const {
    widths = [320, 640, 1024, 1280, 1920],
    extension = 'webp',
  } = options;

  return widths
    .map(width => `${baseUrl}?w=${width}&format=${extension} ${width}w`)
    .join(', ');
}

/**
 * Optimizes image loading with lazy loading and placeholder
 * @param {Object} options - Configuration options
 * @param {string} options.src - The image source URL
 * @param {string} [options.alt=''] - Alt text for the image
 * @param {string} [options.className=''] - Additional CSS classes
 * @param {Object} [options.sizes] - Sizes attribute for responsive images
 * @param {boolean} [options.lazy=true] - Whether to enable lazy loading
 * @param {string} [options.placeholder=PLACEHOLDER_IMAGE] - Placeholder image to show while loading
 * @param {string} [options.extension='webp'] - Preferred image format
 * @returns {Object} - Props to spread on an img element
 */
export function optimizeImage({
  src,
  alt = '',
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  lazy = true,
  placeholder = PLACEHOLDER_IMAGE,
  extension = 'webp',
}) {
  const isRelative = src && !src.startsWith('http') && !src.startsWith('data:');
  const srcSet = isRelative ? createSrcSet(src, { extension }) : null;
  
  return {
    src: isRelative ? `${src}?w=800&format=${extension}` : src,
    ...(srcSet && { srcSet }),
    ...(sizes && { sizes }),
    alt,
    className: `lazy-image ${className}`.trim(),
    loading: lazy ? 'lazy' : 'eager',
    decoding: 'async',
    'data-src': isRelative ? `${src}?w=800&format=${extension}` : src,
    ...(srcSet && { 'data-srcset': srcSet }),
    'data-placeholder': placeholder,
  };
}

/**
 * Lazy loads images with IntersectionObserver
 * @param {string} [selector='.lazy-image'] - Selector for lazy images
 * @param {Object} [options] - IntersectionObserver options
 */
export function lazyLoadImages(selector = '.lazy-image', options = {}) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback for browsers that don't support IntersectionObserver
    const images = document.querySelectorAll(selector);
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Replace src with data-src
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Replace srcset with data-srcset
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          img.removeAttribute('data-srcset');
        }
        
        // Remove placeholder when image loads
        if (img.dataset.placeholder) {
          const placeholder = img.dataset.placeholder;
          img.onload = () => {
            img.style.backgroundImage = 'none';
            img.removeAttribute('data-placeholder');
          };
          
          // Show placeholder until image loads
          if (img.complete) {
            img.onload();
          } else {
            img.style.backgroundImage = `url('${placeholder}')`;
            img.style.backgroundSize = 'cover';
            img.style.backgroundPosition = 'center';
            img.style.backgroundRepeat = 'no-repeat';
          }
        }
        
        // Stop observing
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px',
    threshold: 0.01,
    ...options,
  });

  // Observe all matching images
  document.querySelectorAll(selector).forEach(img => {
    observer.observe(img);
  });
}

/**
 * Initialize lazy loading for images on the page
 * @param {Object} [options] - Options for lazyLoadImages
 */
export function initLazyLoading(options = {}) {
  if (typeof document === 'undefined') return;
  
  // Run immediately for any images already in the DOM
  if (document.readyState === 'complete') {
    lazyLoadImages(options.selector, options);
  } else {
    // Wait for the DOM to be fully loaded
    window.addEventListener('load', () => {
      lazyLoadImages(options.selector, options);
    });
  }
  
  // Also handle dynamically added content
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          lazyLoadImages(options.selector, options);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// Example usage:
/*
// In your main application file (e.g., App.js or main.jsx)
import { initLazyLoading } from '@/utils/imageOptimizer';

// Initialize lazy loading when the app starts
initLazyLoading({
  selector: '.lazy-image',
  rootMargin: '200px',
});

// In your component:
import { optimizeImage } from '@/utils/imageOptimizer';

function MyComponent() {
  return (
    <div>
      <img
        {...optimizeImage({
          src: '/path/to/image.jpg',
          alt: 'Description',
          className: 'my-image',
          sizes: '(max-width: 768px) 100vw, 50vw',
        })}
      />
    </div>
  );
}
*/

// Add this to your CSS for better loading experience:
/*
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  background-color: #f5f5f5;
}

.lazy-image.loaded {
  opacity: 1;
}
*/

// Add this script to your HTML or include it in your bundle:
/*
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('.lazy-image');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => imageObserver.observe(img));
});
*/
