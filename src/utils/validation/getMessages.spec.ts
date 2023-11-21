import { ok } from 'assert'
import i18n, { languageState } from '../i18n'
import { getMessages } from './messages'

describe('getMessages', () => {
  it('has all messages defined', () => {
    const messages = getMessages()
    for (const message in messages) {
      ok(message)
    }
  })
  it('returns messages in the right language', () => {
    languageState.locale = 'en'
    expect(getMessages().required).toEqual(i18n('form.required.error'))
    languageState.locale = 'de'
    expect(getMessages().required).toEqual(i18n('form.required.error'))
  })
})
