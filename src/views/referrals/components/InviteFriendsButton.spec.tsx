import Share from 'react-native-share'
import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { InviteFriendsButton } from './InviteFriendsButton'

describe('InviteFriendsButtonInviteFriendsButton', () => {
  const referralCode = 'HALFIN'
  const inviteLink = 'https://peachbitcoin.com/referral?code=HALFIN'
  const shallowRenderer = createRenderer()
  it('should render component correctly', () => {
    shallowRenderer.render(<InviteFriendsButton {...{ referralCode, inviteLink }} />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('open share dialogue with ref code and invite link', () => {
    const openSpy = jest.spyOn(Share, 'open')
    openSpy.mockResolvedValue({ message: 'ok', success: true })
    const { getByText } = render(<InviteFriendsButton {...{ referralCode, inviteLink }} />)
    fireEvent.press(getByText('invite friends'))
    expect(openSpy).toHaveBeenCalledWith({
      message:
        // eslint-disable-next-line max-len
        "Hey! I've been loving Peach for buying and selling Bitcoin – it's flexible, peer-to-peer, and KYC-free. Join me using my code HALFIN or simply follow this link: https://peachbitcoin.com/referral?code=HALFIN",
    })
  })
})
