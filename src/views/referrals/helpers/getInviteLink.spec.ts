import { setLocaleQuiet } from '../../../utils/i18n'
import { getInviteLink } from './getInviteLink'

describe('getInviteLink', () => {
  it('returns invite link', () => {
    expect(getInviteLink('ADAMSBACK')).toBe('https://peachbitcoin.com/referral?code=ADAMSBACK')
  })
  it('returns localized invite link', () => {
    setLocaleQuiet('de')
    expect(getInviteLink('ADAMSBACK')).toBe('https://peachbitcoin.com/de/referral?code=ADAMSBACK')
  })
})
