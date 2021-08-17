import { ok } from 'assert'
import i18n from '../../src/utils/i18n'

describe('i18n', () => {
  it('sets and returns the current locale', async () => {
    ok('en', i18n.getLocale())
    i18n.setLocale(null, { locale: 'de' })
    ok('de', i18n.getLocale())
  })
  it('returns the localized text for the right locale', async () => {
    i18n.setLocale(null, { locale: 'en' })
    ok('Language', i18n('language'))
    i18n.setLocale(null, { locale: 'de' })
    ok('Sprache', i18n('language'))
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


