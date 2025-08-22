import { useEffect } from "react";

export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const focusableElements = Array.from(
        document.querySelectorAll('[tabindex="0"]:not([disabled])')
      ) as HTMLElement[];
      
      const currentFocus = document.activeElement as HTMLElement;
      const currentIndex = focusableElements.indexOf(currentFocus);
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < focusableElements.length - 1) {
            focusableElements[currentIndex + 1].focus();
          }
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            focusableElements[currentIndex - 1].focus();
          }
          break;
          
        case 'ArrowRight':
          // Handle horizontal navigation within carousels
          if (currentFocus?.closest('.carousel-container')) {
            e.preventDefault();
            const container = currentFocus.closest('.carousel-container');
            const items = Array.from(container?.querySelectorAll('[tabindex="0"]') || []) as HTMLElement[];
            const itemIndex = items.indexOf(currentFocus);
            if (itemIndex < items.length - 1) {
              const nextItem = items[itemIndex + 1];
              nextItem.focus();
              nextItem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
          }
          break;
          
        case 'ArrowLeft':
          // Handle horizontal navigation within carousels
          if (currentFocus?.closest('.carousel-container')) {
            e.preventDefault();
            const container = currentFocus.closest('.carousel-container');
            const items = Array.from(container?.querySelectorAll('[tabindex="0"]') || []) as HTMLElement[];
            const itemIndex = items.indexOf(currentFocus);
            if (itemIndex > 0) {
              const prevItem = items[itemIndex - 1];
              prevItem.focus();
              prevItem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
          }
          break;
          
        case 'Enter':
          e.preventDefault();
          if (currentFocus?.classList.contains('content-card') || 
              currentFocus?.classList.contains('channel-item')) {
            currentFocus.click();
          } else {
            currentFocus?.click();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus first element on mount
    const firstFocusable = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (firstFocusable && !document.activeElement || document.activeElement === document.body) {
      firstFocusable.focus();
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
