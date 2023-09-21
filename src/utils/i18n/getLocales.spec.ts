import { ok } from 'assert'
import i18n from '../i18n'

describe('getLocales', () => {
  it('returns all registered locales', () => {
    ok('en', i18n.getLocales()[0])
    ok(i18n.getLocales().length === 9)
    ok(i18n.getLocales().every((locale) => typeof locale === 'string'))
  })
})
