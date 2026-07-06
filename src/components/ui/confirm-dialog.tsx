'use client'
import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f1111] rounded-xl shadow-2xl border border-white/10 max-w-md w-full mx-4 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            {isDangerous && (
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            )}
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="px-6 pb-6">
          <p className="text-white/80 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white/5 border-t border-white/10 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
              isDangerous
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gold hover:bg-gold/90 text-charcoal'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
