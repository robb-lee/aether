import React from 'react'
import { GridSettings, Viewport } from '../types'

interface GridProps {
  viewport: Viewport
  settings: GridSettings
}

// Lightweight CSS grid: two repeating-linear-gradients (minor + major lines)
export const Grid: React.FC<GridProps> = ({ settings }) => {
  if (!settings.visible) return null

  const size = Math.max(4, settings.size)
  const major = size * 5
  const color = settings.color || '#e5e7eb'

  const bg = [
    // Minor vertical lines
    `repeating-linear-gradient(
      90deg,
      rgba(0,0,0,0) 0,
      rgba(0,0,0,0) ${size - 1}px,
      ${color}${'4D'} ${size - 1}px,
      ${color}${'4D'} ${size}px
    )`,
    // Minor horizontal lines
    `repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0) 0,
      rgba(0,0,0,0) ${size - 1}px,
      ${color}${'4D'} ${size - 1}px,
      ${color}${'4D'} ${size}px
    )`,
    // Major vertical lines
    `repeating-linear-gradient(
      90deg,
      rgba(0,0,0,0) 0,
      rgba(0,0,0,0) ${major - 1}px,
      ${color}${'80'} ${major - 1}px,
      ${color}${'80'} ${major}px
    )`,
    // Major horizontal lines
    `repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0) 0,
      rgba(0,0,0,0) ${major - 1}px,
      ${color}${'80'} ${major - 1}px,
      ${color}${'80'} ${major}px
    )`
  ]

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        backgroundImage: bg.join(', '),
        opacity: 0.8
      }}
    />
  )
}
