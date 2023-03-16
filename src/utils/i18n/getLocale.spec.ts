import { strictEqual } from 'assert'
import i18n from '../i18n'

describe('getLocale', () => {
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
