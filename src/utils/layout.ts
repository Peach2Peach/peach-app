export const mildShadow = {
  distance: 16,
  startColor: '#0000000D',
  finalColor: '#00000000',
  offset: [1, 1] as [x: string | number, y: string | number],
  radius: 0
}

export const dropShadow = {
  distance: 4,
  startColor: '#00000040',
  finalColor: '#00000000',
  offset: [0, 6] as [x: string | number, y: string | number],
  radius: 0
}

export const mildShadowOrange = {
  distance: 14,
  startColor: '#F579400D',
  finalColor: '#F5794000',
  offset: [0, 4] as [x: string | number, y: string | number],
  radius: 0
}


export const mildShadowRed = {
  distance: 4,
  startColor: '#E43B5F0D',
  finalColor: '#E43B5F00',
  offset: [0, 2] as [x: string | number, y: string | number],
  radius: 0
}


export const footerShadow = {
  distance: 16,
  startColor: '#0000000D',
  finalColor: '#00000000',
  offset: [0, -2] as [x: string | number, y: string | number],
  radius: 0
}

export const nativeShadow = {
  shadowColor: '#0000000D',
  shadowOffset: {
    width: 0,
    height: -2,
  },
  shadowOpacity: 0.5,
  shadowRadius: 8
}

export const innerShadow = {
  paintInside: true,
  distance: 16,
  startColor: '#00000000',
  finalColor: '#0000000D',
  offset: [0, 6] as [x: number, y: number],
  radius: 0
}


export const whiteGradient = [
  { offset: '0%', color: '#FCFCFD', opacity: '1' },
  { offset: '100%', color: '#FCFCFD', opacity: '0' }
]