import { ConfirmButton } from './ConfirmButton'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { goBackMock } from '../../../../tests/unit/helpers/NavigationWrapper'

const patchOfferMock = jest.fn()
jest.mock('../../../utils/peachAPI', () => ({
  patchOffer: (...args: unknown[]) => patchOfferMock(...args),
}))

jest.useFakeTimers()

describe('ConfirmButton', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ConfirmButton offerId="1" newPremium={100} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should call patchOffer when clicked', async () => {
    const { getByText } = render(<ConfirmButton offerId="1" newPremium={100} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    fireEvent.press(getByText('confirm'))
    await waitFor(() => expect(patchOfferMock).toHaveBeenCalledWith({ offerId: '1', premium: 100 }))
  })

  it('should navigate back when patchOffer succeeds', async () => {
    patchOfferMock.mockResolvedValueOnce([{ success: true }, null])
    const { getByText } = render(<ConfirmButton offerId="1" newPremium={100} />, {
      wrapper: NavigationAndQueryClientWrapper,
    })
    fireEvent.press(getByText('confirm'))
    await waitFor(() => expect(patchOfferMock).toHaveBeenCalledWith({ offerId: '1', premium: 100 }))
    await waitFor(() => expect(goBackMock).toHaveBeenCalled())
  })
})
