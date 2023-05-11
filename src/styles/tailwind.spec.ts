import tw from './tailwind'

describe('tailwind', () => {
  afterEach(() => {
    tw.setWindowDimensions({ width: 320, height: 700 })
  })
  it('returns correct styles', () => {
    expect(tw`mt-4`).toEqual({ marginTop: 16 })
    expect(tw`text-xl`).toEqual({ fontSize: 20 })
  })
  it('does not return styles for md or lg when on sm', () => {
    tw.setWindowDimensions({ width: 320, height: 700 })
    expect(tw`md:mt-4`).toEqual({})
    expect(tw`lg:text-xl lg:text-error-main`).toEqual({})
  })

  it('does return styles for md when on md', () => {
    tw.setWindowDimensions({ width: 375, height: 840 })
    expect(tw`mt-2 md:mt-4`).toEqual({ marginTop: 16 })
    expect(tw`h7 md:h6`).toEqual({ fontFamily: 'Baloo2-Bold', fontSize: 20, letterSpacing: 0.2, lineHeight: 32 })
    expect(tw`mt-2 md:mt-4 lg:mt-6`).toEqual({ marginTop: 16 })
  })

  it('does return styles for lg when on lg', () => {
    tw.setWindowDimensions({ width: 1200, height: 840 })
    expect(tw`lg:text-xl`).toEqual({ fontSize: 20 })
    expect(tw`mt-2 md:mt-4`).toEqual({ marginTop: 16 })
    expect(tw`mt-2 md:mt-4 lg:mt-6`).toEqual({ marginTop: 24 })
  })
})
