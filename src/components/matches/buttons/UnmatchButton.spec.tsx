import { act, fireEvent, render } from 'test-utils'
import { buyOffer } from '../../../../tests/unit/data/offerData'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { UnmatchPopup } from '../../../popups/UnmatchPopup'
import { MatchUndone } from '../../../popups/app/MatchUndone'
import { appPopups } from '../../../popups/appPopups'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { UnmatchButton } from './UnmatchButton'

jest.useFakeTimers()

const unmatchOfferMock = jest.fn((..._args: unknown[]) =>
  Promise.resolve([
    {
      success: true,
    },
    null,
  ]),
)

jest.mock('../../../utils/peachAPI', () => ({
  unmatchOffer: (...args: unknown[]) => unmatchOfferMock(...args),
}))

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
      originalPaymentData: [],
      releaseAddress: 'releaseAddress',
      online: true,
      matches: [],
      doubleMatched: false,
      tradeStatus: 'searchingForPeer',
      matched: [],
      seenMatches: [],
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
    usePopupStore.getState().setPopup(defaultPopupState)
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

    const expectedPopup = {
      ...usePopupStore.getState(),
      title: i18n('search.popups.unmatch.title'),
      content: <UnmatchPopup />,
      visible: true,
      level: 'WARN',
      action1: {
        label: i18n('search.popups.unmatch.neverMind'),
        icon: 'xSquare',
        callback: expect.any(Function),
      },
      action2: {
        label: i18n('search.popups.unmatch.confirm'),
        icon: 'minusCircle',
        callback: expect.any(Function),
      },
    }

    await act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    expect(usePopupStore.getState()).toStrictEqual(expectedPopup)
  })
  it('should close the popup when action1 is pressed', async () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />)

    await act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    await act(() => {
      usePopupStore.getState().action1?.callback()
    })

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(showUnmatchedCard).not.toHaveBeenCalled()
  })
  it('should unmatch and show confirmation popup when action2 is pressed', async () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />)

    await act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    await act(() => {
      usePopupStore.getState().action2?.callback()
    })

    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: 'unmatched!',
      level: 'WARN',
      visible: true,
    })
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
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: appPopups.matchUndone.title,
      content: <MatchUndone />,
      visible: true,
      level: 'APP',
    })
  })
})
