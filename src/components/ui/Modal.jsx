//   KYA KAAM KARTA HAI:
//   Portal-based modal — body ke direct child mein render
//   hota hai, kisi bhi z-index issue se bachne ke liye.
//   ESC key se bhi close ho jaata hai.
// ============================================================

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  // ESC key se close karo
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    // Body scroll lock
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto z-10`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  )
}