import i18n from '../i18n'

describe('getLocales', () => {
  it('returns all registered locales', () => {
    expect(i18n.getLocales()[0]).toBe('en')
    expect(i18n.getLocales()).toHaveLength(16)
    expect(i18n.getLocales().every((locale) => typeof locale === 'string')).toBeTruthy()
  })
})
