'use client'

import { useEffect } from 'react'

export default function DisableInspect() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Disable common keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - Open DevTools
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac) - Open DevTools
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac) - Open Console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }

      // Ctrl+Shift+C (Windows/Linux) or Cmd+Option+C (Mac) - Inspect Element
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return false
      }

      // Ctrl+U (Windows/Linux) or Cmd+U (Mac) - View Source
      if ((e.ctrlKey || e.metaKey) && e.key === 'U') {
        e.preventDefault()
        return false
      }

      // Ctrl+S (Windows/Linux) or Cmd+S (Mac) - Save Page (can be used to inspect)
      if ((e.ctrlKey || e.metaKey) && e.key === 'S') {
        e.preventDefault()
        return false
      }
    }

    // Disable text selection (optional - can be removed if you want users to select text)
    const handleSelectStart = (e: Event) => {
      // Allow text selection in input/textarea elements
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true
      }
      // Optionally disable selection elsewhere
      // e.preventDefault()
      // return false
    }

    // Disable drag and drop (prevents dragging images to save)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('dragstart', handleDragStart)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('dragstart', handleDragStart)
    }
  }, [])

  return null
}
