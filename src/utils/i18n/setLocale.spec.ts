import { strictEqual } from 'assert'
import i18n from '../i18n'

describe('setLocale', () => {
  it('sets and returns the current locale', () => {
    strictEqual('en', i18n.getLocale())
    i18n.setLocale(null, { locale: 'fr' })
    strictEqual('fr', i18n.getLocale())
  })

  it('falls back to en locale if locale is not registered', () => {
    i18n.setLocale(null, { locale: 'ufo' })
    strictEqual('en', i18n.getLocale())
  })
})
