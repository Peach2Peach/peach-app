import { mockDimensions } from '../../../tests/unit/helpers/mockDimensions'
import tw from '../../styles/tailwind'
import { getHeaderStyles } from './getHeaderStyles'

describe('getHeaderStyles', () => {
  it('returns header styles', () => {
    mockDimensions({ width: 320, height: 600 })

    const result = getHeaderStyles()

    expect(result).toEqual({
      fontSize: [{ fontFamily: 'Baloo2-Bold', fontSize: 16, letterSpacing: 0.16, lineHeight: 26 }, {}],
      iconSize: [{ height: 20, width: 20 }, {}],
    })
  })
  it('returns header styles for medium viewports', () => {
    mockDimensions({ width: 600, height: 840 })
    tw.setWindowDimensions({ width: 600, height: 840 })

    const result = getHeaderStyles()

    expect(result).toEqual({
      fontSize: [
        { fontFamily: 'Baloo2-Bold', fontSize: 16, letterSpacing: 0.16, lineHeight: 26 },
        { fontFamily: 'Baloo2-Bold', fontSize: 20, letterSpacing: 0.2, lineHeight: 32 },
      ],
      iconSize: [
        { height: 20, width: 20 },
        { height: 24, width: 24 },
      ],
    })
  })
})
