import { useEffect, useCallback } from 'react';
import { KeyboardShortcut } from '../types';

interface KeyboardNavigationOptions {
  onKeyboardShortcut: (shortcut: KeyboardShortcut) => void;
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardNavigation = ({
  onKeyboardShortcut,
  enabled = true,
  preventDefault = true
}: KeyboardNavigationOptions) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { code, ctrlKey, metaKey, shiftKey } = event;
    const isModifier = ctrlKey || metaKey;
    
    // Check if the target is an input, textarea, or contenteditable element
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true';

    // Don't handle keyboard shortcuts when focused on input fields
    if (isInputField) {
      return;
    }

    // Prevent default behavior for navigation keys
    const navigationKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
      'KeyA', 'Escape', 'Delete', 'Backspace'
    ];
    
    if (preventDefault && navigationKeys.includes(code)) {
      if (code === 'KeyA' && isModifier) {
        event.preventDefault();
      } else if (code.startsWith('Arrow')) {
        event.preventDefault();
      } else if (['Escape', 'Delete', 'Backspace'].includes(code)) {
        event.preventDefault();
      }
    }

    // Map keyboard events to shortcuts
    let shortcut: KeyboardShortcut | null = null;

    switch (code) {
      case 'KeyA':
        if (isModifier) {
          shortcut = 'select-all';
        }
        break;
      
      case 'Escape':
        shortcut = 'deselect-all';
        break;
      
      case 'Delete':
      case 'Backspace':
        shortcut = 'delete-selected';
        break;
      
      case 'ArrowUp':
        shortcut = shiftKey ? 'extend-up' : 'move-up';
        break;
      
      case 'ArrowDown':
        shortcut = shiftKey ? 'extend-down' : 'move-down';
        break;
      
      case 'ArrowLeft':
        shortcut = shiftKey ? 'extend-left' : 'move-left';
        break;
      
      case 'ArrowRight':
        shortcut = shiftKey ? 'extend-right' : 'move-right';
        break;
    }

    if (shortcut) {
      onKeyboardShortcut(shortcut);
    }
  }, [enabled, preventDefault, onKeyboardShortcut]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Return utility functions for manual shortcut triggering
  return {
    triggerShortcut: onKeyboardShortcut
  };
};