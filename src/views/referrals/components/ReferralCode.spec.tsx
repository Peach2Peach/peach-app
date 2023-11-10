import Share from 'react-native-share'
import { fireEvent, render, waitFor } from 'test-utils'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { ReferralCode } from './ReferralCode'

jest.useFakeTimers()

describe('ReferralCode', () => {
  it('should render component correctly', async () => {
    await waitFor(() => {
      expect(queryClient.isFetching()).toBeFalsy()
    })
    expect(render(<ReferralCode />)).toMatchSnapshot()
  })
  it('open share dialogue with ref code and invite link', async () => {
    const openSpy = jest.spyOn(Share, 'open')
    openSpy.mockResolvedValue({ message: 'ok', success: true })
    await waitFor(() => {
      expect(queryClient.isFetching()).toBeFalsy()
    })

    const { getByText } = render(<ReferralCode />)
    fireEvent.press(getByText('invite friends'))
    expect(openSpy).toHaveBeenCalledWith({
      message:
        // eslint-disable-next-line max-len
        "Hey! I've been loving Peach for buying and selling Bitcoin – it's flexible, peer-to-peer, and KYC-free. Join me using my code PR0063 or simply follow this link: https://peachbitcoin.com/referral?code=PR0063",
    })
  })
})
