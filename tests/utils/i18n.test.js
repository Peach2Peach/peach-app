import { ok } from 'assert'
import i18n from '../../src/utils/i18n'

describe('setLocale & getLocale', () => {
  it('sets and returns the current locale', async () => {
    ok('en', i18n.getLocale())
    i18n.setLocale(null, { locale: 'de' })
    ok('de', i18n.getLocale())
  })

  it('falls back to en locale if locale is not registered', async () => {
    i18n.setLocale(null, { locale: 'ufo' })
    ok('en', i18n.getLocale())
  })
})

describe('getLocales', () => {
  it('returns all registered locales', async () => {
    ok('en', i18n.getLocales()[0])
    ok(i18n.getLocales().length > 2)
    ok(i18n.getLocales().every(locale => typeof locale === 'string'))
  })
})

describe('i18n', () => {
  it('returns the localized text for the right locale', async () => {
    i18n.setLocale(null, { locale: 'en' })
    ok('Language', i18n('language'))
    i18n.setLocale(null, { locale: 'de' })
    ok('Sprache', i18n('language'))
  })

  it('falls back gracefully', async () => {
    i18n.setLocale(null, { locale: 'de-CH' })
    ok('Fallback Test 1 de-CH', i18n('i18n.test.fallback.1'))
    ok('Fallback Test 2 de', i18n('i18n.test.fallback.2'))
    ok('Fallback Test 3 en', i18n('i18n.test.fallback.3'))

    i18n.setLocale(null, { locale: 'de' })
    ok('Fallback Test 1 de', i18n('i18n.test.fallback.1'))
    ok('Fallback Test 2 de', i18n('i18n.test.fallback.2'))
    ok('Fallback Test 3 en', i18n('i18n.test.fallback.3'))

    i18n.setLocale(null, { locale: 'en' })
    ok('Fallback Test 1 en', i18n('i18n.test.fallback.1'))
    ok('Fallback Test 2 en', i18n('i18n.test.fallback.2'))
    ok('Fallback Test 3 en', i18n('i18n.test.fallback.3'))
  })

  it('returns id only if text could not be mapped', async () => {
    ok('id.not.existing', i18n('id.not.existing'))
  })

  it('returns the localized text for the right locale with arguments', async () => {
    i18n.setLocale(null, { locale: 'en' })
    ok('Variable test: Hello John $2', i18n('currency.sats', 'Hello', 'John'))
    ok('Variable test: Hello John Doe', i18n('currency.sats', 'Hello', 'John', 'Doe'))
    ok('100000 sats', i18n('currency.sats', 100000))

    i18n.setLocale(null, { locale: 'de' })
    ok('Variablen test: Hello John Doe', i18n('currency.sats', 'Hello', 'John', 'Doe'))
    ok('1000 sats', i18n('currency.sats', 1000))
  })
})
