import { strictEqual } from 'assert'
import i18n, { locale } from '../i18n'

describe('setLocale', () => {
  it('sets and returns the current locale', () => {
    strictEqual('en', locale)
    i18n.setLocale(null, { locale: 'de' })
    strictEqual('de', locale)
  })

  it('falls back to en locale if locale is not registered', () => {
    i18n.setLocale(null, { locale: 'ufo' })
    strictEqual('en', locale)
  })
})
