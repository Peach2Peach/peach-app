import { fireEvent, render } from '@testing-library/react-native'
import Share from 'react-native-share'
import { createRenderer } from 'react-test-renderer/shallow'
import { ReferralCode } from './ReferralCode'

describe('ReferralCode', () => {
  const shallowRenderer = createRenderer()
  it('should render component correctly', () => {
    shallowRenderer.render(<ReferralCode referralCode="HALFIN" />)
    expect(shallowRenderer.getRenderOutput()).toMatchSnapshot()
  })
  it('open share dialogue with ref code and invite link', () => {
    const openSpy = jest.spyOn(Share, 'open')
    openSpy.mockResolvedValue({ message: 'ok', success: true })
    const { getByText } = render(<ReferralCode referralCode="HALFIN" />)
    fireEvent.press(getByText('invite friends'))
    expect(openSpy).toHaveBeenCalledWith({
      message:
        // eslint-disable-next-line max-len
        "Hey! I've been loving Peach for buying and selling Bitcoin – it's flexible, peer-to-peer, and KYC-free. Join me using my code HALFIN or simply follow this link:",
      url: 'https://peachbitcoin.com/referral?code=HALFIN',
    })
  })
})
