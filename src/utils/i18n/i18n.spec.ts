import i18n, { languageState } from '../i18n'

describe('i18n', () => {
  it('returns the localized text for the right locale', () => {
    languageState.locale = 'en'
    expect(i18n('language')).toBe('language')
    languageState.locale = 'fr'
    expect(i18n('language')).toBe('langue')
  })
  it('returns key of text if locale is "raw"', () => {
    languageState.locale = 'raw'
    expect(i18n('i18n.test.fallback.1')).toBe('i18n.test.fallback.1')
  })

  it('falls back gracefully', () => {
    languageState.locale = 'fr-CH'
    expect(i18n('i18n.test.fallback.1')).toBe('Fallback Test 1 fr')
    expect(i18n('i18n.test.fallback.2')).toBe('Fallback Test 2 fr')
    expect(i18n('i18n.test.fallback.3')).toBe('Fallback Test 3 fr')

    languageState.locale = 'en'
    expect(i18n('i18n.test.fallback.1')).toBe('Fallback Test 1 en')
    expect(i18n('i18n.test.fallback.2')).toBe('Fallback Test 2 en')
    expect(i18n('i18n.test.fallback.3')).toBe('Fallback Test 3 en')

    languageState.locale = 'cn-US'
    expect(i18n('i18n.test.fallback.1')).toBe('Fallback Test 1 en')
    expect(i18n('i18n.test.fallback.2')).toBe('Fallback Test 2 en')
    expect(i18n('i18n.test.fallback.3')).toBe('Fallback Test 3 en')
  })

  it('returns id only if text could not be mapped', () => {
    expect(i18n('id.not.existing')).toBe('id.not.existing')
  })

  it('returns the localized text for the right locale with arguments', () => {
    languageState.locale = 'en'
    expect(i18n('i18n.test', 'Hello', 'John')).toBe('Variable test: Hello John $2')
    expect(i18n('i18n.test', 'Hello', 'John', 'Doe')).toBe('Variable test: Hello John Doe')
    expect(i18n('currency.format.sats', '100000')).toBe('100000 sats')

    languageState.locale = 'fr'
    expect(i18n('i18n.test', 'Hello', 'John', 'Doe')).toBe('Test de variable : Hello John Doe')
    expect(i18n('currency.format.sats', '1000')).toBe('1000 sats')
  })

  it('avoids orphans for 4 or more words', () => {
    languageState.locale = 'en'
    expect(i18n('i18n.test.two')).toBe('two words')
    expect(i18n('i18n.test.three')).toBe('cool three words')
    expect(i18n('i18n.test.four')).toBe('four words are nice')
    expect(i18n('i18n.test.five')).toBe('five words get very interesting')
  })
  it('ignores orphans for 4 or more words', () => {
    languageState.locale = 'en'
    expect(i18n.break('i18n.test.five')).toBe('five words get very interesting')
  })
})
