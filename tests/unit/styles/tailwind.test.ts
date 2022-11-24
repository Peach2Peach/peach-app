import { deepStrictEqual } from 'assert'
import tw from '../../../src/styles/tailwind'

type Dimension = {
  width: number
  height: number
}

const mockDimensions = ({ width, height }: Dimension) => {
  jest.resetModules()
  jest.doMock('react-native/Libraries/Utilities/Dimensions', () => ({
    get: jest.fn().mockReturnValue({ width, height }),
  }))
}
describe('tailwind', () => {
  it('returns correct styles', () => {
    deepStrictEqual(tw`mt-4`, { marginTop: 16 })
    deepStrictEqual(tw`text-xl text-warning-dark`, {
      color: '#917201',
      fontSize: 20,
    })
  })
  it('does not return styles for md or lg when on sm', () => {
    mockDimensions({
      width: 320,
      height: 700,
    })
    deepStrictEqual(tw.md`mt-4`, {})
    deepStrictEqual(tw.lg`text-xl text-red`, {})
  })

  it('does return styles for sm and md when on md', () => {
    mockDimensions({
      width: 600,
      height: 840,
    })
    deepStrictEqual(tw.lg`text-xl text-red`, {})
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`], [{ marginTop: 8 }, { marginTop: 16 }])
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`, tw.lg`mt-6`], [{ marginTop: 8 }, { marginTop: 16 }, {}])
  })

  it('does return styles for sm and md when on lg', () => {
    mockDimensions({
      width: 1200,
      height: 840,
    })
    deepStrictEqual(tw.lg`text-xl text-warning-dark`, {
      color: '#917201',
      fontSize: 20,
    })
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`], [{ marginTop: 8 }, { marginTop: 16 }])
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`, tw.lg`mt-6`], [{ marginTop: 8 }, { marginTop: 16 }, { marginTop: 24 }])
  })
})
