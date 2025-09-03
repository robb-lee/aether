'use client'

import { useState } from 'react'

interface PreviewControlsProps {
  siteId: string
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void
  onZoomChange: (zoom: 50 | 75 | 100 | 125) => void
  selectedDevice: 'desktop' | 'tablet' | 'mobile'
  zoomLevel: 50 | 75 | 100 | 125
}

export function PreviewControls({
  siteId,
  onDeviceChange,
  onZoomChange,
  selectedDevice,
  zoomLevel
}: PreviewControlsProps) {
  const [showComponentBounds, setShowComponentBounds] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleExportHTML = async () => {
    try {
      const response = await fetch(`/api/sites/${siteId}/export?format=html`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `site-${siteId}.html`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleSharePreview = async () => {
    const previewUrl = `${window.location.origin}/preview/${siteId}`
    try {
      await navigator.clipboard.writeText(previewUrl)
      alert('Preview URL copied to clipboard!')
    } catch (error) {
      console.error('Copy failed:', error)
      prompt('Copy this URL:', previewUrl)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="space-y-4">
          {/* Device Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Preview
            </label>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'desktop', name: 'Desktop', icon: '🖥️' },
                { id: 'tablet', name: 'Tablet', icon: '📱' },
                { id: 'mobile', name: 'Mobile', icon: '📱' }
              ].map(device => (
                <button
                  key={device.id}
                  onClick={() => onDeviceChange(device.id as any)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedDevice === device.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="block sm:hidden">{device.icon}</span>
                  <span className="hidden sm:block">{device.icon} {device.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Zoom Control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom Level
            </label>
            <div className="flex gap-1">
              {[50, 75, 100, 125].map(zoom => (
                <button
                  key={zoom}
                  onClick={() => onZoomChange(zoom as any)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    zoomLevel === zoom
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {zoom}%
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showComponentBounds}
                onChange={(e) => setShowComponentBounds(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show component bounds</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Dark mode preview</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={handleSharePreview}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              🔗 Share Preview
            </button>
            
            <button
              onClick={handleExportHTML}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              📥 Export HTML
            </button>
            
            <a
              href={`/editor/${siteId}`}
              className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium text-center"
            >
              ✏️ Edit Site
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewControls