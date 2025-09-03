'use client'

import { useState } from 'react'

interface PreviewHeaderProps {
  siteData: {
    id: string
    name: string
    metadata?: any
  }
  siteId: string
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'
type ZoomLevel = 50 | 75 | 100 | 125

export function PreviewHeader({ siteData, siteId }: PreviewHeaderProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop')
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(100)
  const [showMetrics, setShowMetrics] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const devices = [
    { id: 'desktop', name: 'Desktop', icon: '🖥️', width: '100%' },
    { id: 'tablet', name: 'Tablet', icon: '📱', width: '768px' },
    { id: 'mobile', name: 'Mobile', icon: '📱', width: '375px' }
  ] as const

  const zoomLevels = [50, 75, 100, 125] as const

  return (
    <div className="bg-gray-800 text-white p-4 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Site Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-lg font-semibold">{siteData.name || 'Generated Site'}</h1>
            <span className="px-2 py-1 bg-green-600 text-xs rounded-full">Live Preview</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>Site ID: {siteId}</span>
            <span>•</span>
            <span>Device: {devices.find(d => d.id === selectedDevice)?.name}</span>
            <span>•</span>
            <span>Zoom: {zoomLevel}%</span>
          </div>
        </div>

        {/* Preview Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Device Toggle */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDevice === device.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
                title={`Preview in ${device.name}`}
              >
                <span className="hidden sm:inline">{device.icon} {device.name}</span>
                <span className="sm:hidden">{device.icon}</span>
              </button>
            ))}
          </div>

          {/* Zoom Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Zoom:</span>
            <select
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value) as ZoomLevel)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            >
              {zoomLevels.map(level => (
                <option key={level} value={level}>{level}%</option>
              ))}
            </select>
          </div>

          {/* Toggle Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                showMetrics
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📊 Metrics
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                darkMode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <a 
              href={`/editor/${siteId}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
            >
              Edit Site
            </a>
            
            <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium">
              Share
            </button>
            
            <a 
              href="/generate"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-medium"
            >
              Generate New
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Panel */}
      {showMetrics && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">95</div>
              <div className="text-gray-300">Lighthouse</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">1.2s</div>
              <div className="text-gray-300">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">85KB</div>
              <div className="text-gray-300">Bundle Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">AA</div>
              <div className="text-gray-300">Accessibility</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Custom hook for device and zoom state
export function usePreviewControls() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop')
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(100)

  const getDeviceWidth = () => {
    switch (selectedDevice) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      case 'desktop': return '100%'
      default: return '100%'
    }
  }

  const getZoomScale = () => zoomLevel / 100

  return {
    selectedDevice,
    setSelectedDevice,
    zoomLevel,
    setZoomLevel,
    deviceWidth: getDeviceWidth(),
    zoomScale: getZoomScale()
  }
}