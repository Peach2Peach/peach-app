import { ok, strictEqual } from 'assert'
import i18n from '../../src/utils/i18n'

describe('setLocale & getLocale', () => {
  it('sets and returns the current locale', () => {
    strictEqual('en', i18n.getLocale())
    i18n.setLocale(null, { locale: 'de' })
    strictEqual('de', i18n.getLocale())
  })

  it('falls back to en locale if locale is not registered', () => {
    i18n.setLocale(null, { locale: 'ufo' })
    strictEqual('en', i18n.getLocale())
  })
})

describe('getLocales', () => {
  it('returns all registered locales', () => {
    ok('en', i18n.getLocales()[0])
    ok(i18n.getLocales().length > 2)
    ok(i18n.getLocales().every(locale => typeof locale === 'string'))
  })
})

describe('i18n', () => {
  it('returns the localized text for the right locale', () => {
    i18n.setLocale(null, { locale: 'en' })
    strictEqual('Language', i18n('language'))
    i18n.setLocale(null, { locale: 'de' })
    strictEqual('Sprache', i18n('language'))
  })

  it('falls back gracefully', () => {
    i18n.setLocale(null, { locale: 'de-CH' })
    strictEqual('Fallback Test 1 de-CH', i18n('i18n.test.fallback.1'))
    strictEqual('Fallback Test 2 de', i18n('i18n.test.fallback.2'))
    strictEqual('Fallback Test 3 en', i18n('i18n.test.fallback.3'))

    i18n.setLocale(null, { locale: 'de' })
    strictEqual('Fallback Test 1 de', i18n('i18n.test.fallback.1'))
    strictEqual('Fallback Test 2 de', i18n('i18n.test.fallback.2'))
    strictEqual('Fallback Test 3 en', i18n('i18n.test.fallback.3'))

    i18n.setLocale(null, { locale: 'en' })
    strictEqual('Fallback Test 1 en', i18n('i18n.test.fallback.1'))
    strictEqual('Fallback Test 2 en', i18n('i18n.test.fallback.2'))
    strictEqual('Fallback Test 3 en', i18n('i18n.test.fallback.3'))
  })

  it('returns id only if text could not be mapped', () => {
    strictEqual('id.not.existing', i18n('id.not.existing'))
  })

  it('returns the localized text for the right locale with arguments', () => {
    i18n.setLocale(null, { locale: 'en' })
    strictEqual('Variable test: Hello John $2', i18n('i18n.test', 'Hello', 'John'))
    strictEqual('Variable test: Hello John Doe', i18n('i18n.test', 'Hello', 'John', 'Doe'))
    strictEqual('100000 sats', i18n('currency.format.sats', 100000))

    i18n.setLocale(null, { locale: 'de' })
    strictEqual('Variablen test: Hello John Doe', i18n('i18n.test', 'Hello', 'John', 'Doe'))
    strictEqual('1000 sats', i18n('currency.format.sats', 1000))
  })
})
