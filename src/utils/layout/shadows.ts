import { ShadowType } from '../../components/ui/Shadow'

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

export const selectionShadow: ShadowType = {
  blur: 8,
  color: '#2B1911',
  opacity: 0.16,
  offsetX: 0,
  offsetY: 0,
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
  blur: 8,
  opacity: 0.08,
  color: '#9D8276',
  offsetX: 0,
  offsetY: -10,
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
  blur: 8,
  color: '#000000',
  opacity: 0.16,
  offsetX: 2,
  offsetY: 2,
}

export const textShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.15)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 2,
}
