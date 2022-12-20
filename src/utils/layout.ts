import { ShadowType } from '../components/ui/Shadow'

export const noShadow: ShadowType = {
  blur: 0,
  color: '#000000',
}

export const mildShadow: ShadowType = {
  blur: 16,
  color: '#000000',
  opacity: 0.05,
  offsetX: 0,
  offsetY: 6,
}

export const dropShadow: ShadowType = {
  blur: 4,
  color: '#000000',
  offsetX: 0,
  offsetY: 6,
}

export const dropShadowMild: ShadowType = {
  blur: 16,
  color: '#2B1911',
  opacity: 0.24,
  offsetX: 0,
  offsetY: 0,
}

export const mildShadowOrange = {
  blur: 14,
  color: '#F57940',
  opacity: 0.18,
  offsetX: 0,
  offsetY: 4,
}

export const dropShadowRed = {
  blur: 4,
  color: '#E43B5F',
  opacity: 0.18,
  offsetX: 0,
  offsetY: 2,
}

export const mildShadowRed = {
  blur: 14,
  color: '#E43B5F',
  opacity: 0.18,
  offsetX: 0,
  offsetY: 4,
}

export const footerShadow: ShadowType = {
  blur: 16,
  opacity: 0.05,
  color: '#000000',
  offsetX: 0,
  offsetY: -2,
}

export const nativeShadow = {
  shadowColor: '#0000000D',
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.5,
  shadowRadius: 8,
}

export const innerShadow: ShadowType = {
  inset: true,
  blur: 16,
  color: '#000000',
  opacity: 0.05,
  offsetX: 0,
  offsetY: 6,
}

export const whiteGradient = [
  { offset: '0%', color: '#FCFCFD', opacity: '1' },
  { offset: '100%', color: '#FCFCFD', opacity: '0' },
]

export const primaryGradient = [
  { offset: '0%', color: '#FFA24C', opacity: '1' },
  { offset: '50.25%', color: '#FF7A50', opacity: '1' },
  { offset: '100%', color: '#FF4D42', opacity: '1' },
]

export const textShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.15)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 2,
}

/**
 * @description Method to convert short hex colors (3 digits) to long hex colors (6 digits)
 * @param hex hex color (e.g.: #000 or #000000)
 * @returns 6 digit hex color
 */
export const shortToLongHex = (color: string) => {
  const hex = color.replace('#', '')
  const longHex
    = hex.length === 3
      ? hex
        .split('')
        .map((h) => h + h)
        .join('')
      : hex

  return '#' + longHex
}
