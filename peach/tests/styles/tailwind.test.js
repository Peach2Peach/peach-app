import { deepStrictEqual } from 'assert'
import tw from '../../src/styles/tailwind'
import GetWindowDimensions from '../../src/hooks/GetWindowDimensions'

jest.mock('../../src/hooks/GetWindowDimensions')

describe('tailwind', () => {
  it('returns correct styles', async () => {
    deepStrictEqual(tw`mt-4`, { marginTop: 16 })
    deepStrictEqual(tw`text-xl text-red-200`, {
      color: 'rgba(254, 202, 202, 1)',
      fontSize: 20
    })
  })
  it('does not return styles for md or lg when on sm', async () => {
    GetWindowDimensions.mockReturnValue({
      width: 320
    })
    deepStrictEqual(tw.md`mt-4`, {})
    deepStrictEqual(tw.lg`text-xl text-red-200`, {})
  })

  it('does return styles for sm and md when on md', async () => {
    GetWindowDimensions.mockReturnValue({
      width: 600
    })
    deepStrictEqual(tw.lg`text-xl text-red-200`, {})
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`], [{ marginTop: 8 }, { marginTop: 16 }])
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`, tw.lg`mt-6`], [{ marginTop: 8 }, { marginTop: 16 }, {}])
  })

  it('does return styles for sm and md when on lg', async () => {
    GetWindowDimensions.mockReturnValue({
      width: 1200
    })
    deepStrictEqual(tw.lg`text-xl text-red-200`, {
      color: 'rgba(254, 202, 202, 1)',
      fontSize: 20,
    })
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`], [{ marginTop: 8 }, { marginTop: 16 }])
    deepStrictEqual([tw`mt-2`, tw.md`mt-4`, tw.lg`mt-6`], [{ marginTop: 8 }, { marginTop: 16 }, { marginTop: 24 }])
  })
})