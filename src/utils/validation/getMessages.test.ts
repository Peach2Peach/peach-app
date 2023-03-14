import { ok } from 'assert'
import i18n from '../i18n'
import { getMessages } from '.'

describe('getMessages', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('has all messages defined', () => {
    const messages = getMessages()
    for (const message in messages) {
      ok(message)
    }
  })
  it('returns messages in the right language', () => {
    i18n.setLocale(null, { locale: 'en' })
    expect(getMessages().required).toEqual(i18n('form.required.error'))
    i18n.setLocale(null, { locale: 'de' })
    expect(getMessages().required).toEqual(i18n('form.required.error'))
  })
})
