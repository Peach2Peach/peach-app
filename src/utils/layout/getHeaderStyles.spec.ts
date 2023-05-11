import { getHeaderStyles } from '.'
import tw from '../../styles/tailwind'

describe('getHeaderStyles', () => {
  it('returns header styles', () => {
    tw.setWindowDimensions({ width: 320, height: 600 })

    const result = getHeaderStyles()

    expect(result).toEqual({
      iconSize: { height: 20, width: 20 },
      fontSize: { fontFamily: 'Baloo2-Bold', fontSize: 16, letterSpacing: 0.16, lineHeight: 26 },
    })
  })
  it('returns header styles for medium viewports', () => {
    tw.setWindowDimensions({ width: 600, height: 840 })

    const result = getHeaderStyles()

    expect(result).toEqual({
      iconSize: { height: 24, width: 24 },
      fontSize: { fontFamily: 'Baloo2-Bold', fontSize: 20, letterSpacing: 0.2, lineHeight: 32 },
    })
  })
})
