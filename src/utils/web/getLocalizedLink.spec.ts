import { getLocalizedLink } from './getLocalizedLink'

describe('getLocalizedLink', () => {
  it('should return the localized link to peach homepage', () => {
    expect(getLocalizedLink('privacy-policy', 'en')).toBe('peachbitcoin.com/privacy-policy')
    expect(getLocalizedLink('privacy-policy', 'de')).toBe('peachbitcoin.com/de/privacy-policy')
    expect(getLocalizedLink('privacy-policy', 'el-GR')).toBe('peachbitcoin.com/el/privacy-policy')
  })
})
