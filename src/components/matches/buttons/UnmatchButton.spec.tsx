import { act, fireEvent, render } from 'test-utils'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { WarningPopup } from '../../../popups/WarningPopup'
import { ClosePopupAction } from '../../../popups/actions'
import { MatchUndone } from '../../../popups/app/MatchUndone'
import { appPopups } from '../../../popups/appPopups'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { peachAPI } from '../../../utils/peachAPI'
import { Popup } from '../../popup'
import { PopupComponent } from '../../popup/PopupComponent'
import { UnmatchButton } from './UnmatchButton'

jest.useFakeTimers()

const unmatchOfferMock = jest.spyOn(peachAPI.private.offer, 'unmatchOffer')

describe('UnmatchButton', () => {
  const interruptMatching = jest.fn()
  const showUnmatchedCard = jest.fn()
  const defaultProps = {
    match: {
      matched: true,
      offerId: 'offerId',
    },
    offer: {
      ...buyOffer,
      id: 'offerId',
      type: 'bid',
      amount: [21000, 210000],
      creationDate: new Date('2021-01-01'),
      meansOfPayment: { EUR: ['sepa'] },
      paymentData: {
        sepa: { hashes: ['fakeHash'] },
      },
      releaseAddress: 'releaseAddress',
      online: true,
      matches: [],
      doubleMatched: false,
      tradeStatus: 'searchingForPeer',
    } satisfies BuyOffer | SellOffer,
    interruptMatching,
    showUnmatchedCard,
  }

  beforeEach(() => {
    queryClient.setQueryData(['matches', 'offerId'], {
      pages: [
        {
          matches: [
            {
              matched: true,
              offerId: 'offerId',
            },
          ],
        },
      ],
    })
    usePopupStore.getState().setPopup(defaultPopupState.popupComponent)
  })
  it('renders correctly', () => {
    const { toJSON } = render(<UnmatchButton {...defaultProps} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show the undo button if not yet matched', () => {
    const { toJSON } = render(<UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show the unmatch button again after the timer is over', async () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />)
    await act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(getByText(i18n('search.unmatch'))).toBeTruthy()
  })
  it('should show the unmatch popup when unmatch is pressed', async () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />)

    await act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })
    expect(usePopupStore.getState().visible).toBeTruthy()
  })
  it('should close the popup when action1 is pressed', async () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />)

    await act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    const { getByText: getByTextInPopup } = render(<Popup />)
    await act(() => {
      fireEvent.press(getByTextInPopup(i18n('search.popups.unmatch.neverMind')))
    })

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(showUnmatchedCard).not.toHaveBeenCalled()
  })
  it('should unmatch and show confirmation popup when action2 is pressed', async () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />)

    await act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    const { getByText: getByTextInPopup } = render(<Popup />)
    await act(() => {
      fireEvent.press(getByTextInPopup(i18n('search.popups.unmatch.confirm')))
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <WarningPopup
        title={i18n('search.popups.unmatched')}
        actions={<ClosePopupAction style={tw`justify-center`} textStyle={tw`text-black-1`} />}
      />,
    )

    expect(showUnmatchedCard).toHaveBeenCalled()
    expect(unmatchOfferMock).toHaveBeenCalledWith({ offerId: 'offerId', matchingOfferId: 'offerId' })
    expect(queryClient.getQueryData(['matches', 'offerId'])).toStrictEqual({
      pages: [
        {
          matches: [
            {
              matched: false,
              offerId: 'offerId',
            },
          ],
        },
      ],
    })
  })
  it('should call showUnmatchedCard when undo is pressed', async () => {
    const { getAllByText } = render(
      <UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />,
    )

    await act(() => {
      fireEvent.press(getAllByText(i18n('search.undo'))[0])
    })

    expect(showUnmatchedCard).toHaveBeenCalled()
  })
  it('should call interruptMatching when undo is pressed', async () => {
    const { getAllByText } = render(
      <UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />,
    )

    await act(() => {
      fireEvent.press(getAllByText(i18n('search.undo'))[0])
    })

    expect(interruptMatching).toHaveBeenCalled()
  })
  it('show the match undone popup when undo is pressed', async () => {
    const { getAllByText } = render(
      <UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />,
    )

    await act(() => {
      fireEvent.press(getAllByText('undo')[0])
    })
    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title={appPopups.matchUndone.title}
        content={<MatchUndone />}
        actions={<ClosePopupAction style={tw`justify-center`} />}
      />,
    )
  })
})
