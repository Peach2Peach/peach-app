import { UnmatchButton } from './UnmatchButton'
import { render, fireEvent, act } from '@testing-library/react-native'
import { queryClient, QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import i18n from '../../../utils/i18n'
import { defaultOverlay, OverlayContext } from '../../../contexts/overlay'
import { UnmatchPopup } from '../../../overlays/UnmatchPopup'
import { appOverlays } from '../../../overlays/appOverlays'

jest.useFakeTimers()

const unmatchOfferMock = jest.fn((..._args: any[]) =>
  Promise.resolve([
    {
      success: true,
    },
    null,
  ]),
)

jest.mock('../../../utils/peachAPI', () => ({
  unmatchOffer: (...args: any[]) => unmatchOfferMock(...args),
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
      id: 'offerId',
      type: 'bid',
      amount: [21000, 210000],
      creationDate: new Date('2021-01-01'),
      meansOfPayment: { EUR: ['sepa'] },
      paymentData: {
        sepa: {
          hash: 'fakeHash',
        },
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

  let overlay = { ...defaultOverlay }
  const updateOverlay = jest.fn((newOverlay) => {
    overlay = newOverlay
  })
  const OverlayContextWrapper = (children: JSX.Element) => (
    <OverlayContext.Provider value={[overlay, updateOverlay]}>{children}</OverlayContext.Provider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
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
    overlay = { ...defaultOverlay }
  })
  it('renders correctly', () => {
    const { toJSON } = render(<UnmatchButton {...defaultProps} />, { wrapper: QueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show the undo button if not yet matched', () => {
    const { toJSON } = render(<UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />, {
      wrapper: QueryClientWrapper,
    })
    expect(toJSON()).toMatchSnapshot()
  })
  it('should show the unmatch button again after the timer is over', () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />, {
      wrapper: QueryClientWrapper,
    })
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(getByText(i18n('search.unmatch'))).toBeTruthy()
  })
  it('should show the unmatch popup when unmatch is pressed', () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />, {
      wrapper: ({ children }) => OverlayContextWrapper(QueryClientWrapper({ children })),
    })

    const expectedOverlay = {
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

    act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    expect(overlay).toStrictEqual(expectedOverlay)
  })
  it('should close the overlay when action1 is pressed', () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />, {
      wrapper: ({ children }) => OverlayContextWrapper(QueryClientWrapper({ children })),
    })

    act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    act(() => {
      overlay?.action1?.callback()
    })

    expect(overlay.visible).toBeFalsy()
    expect(showUnmatchedCard).not.toHaveBeenCalled()
  })
  it('should unmatch when action2 is pressed', async () => {
    const { getByText } = render(<UnmatchButton {...defaultProps} />, {
      wrapper: ({ children }) => OverlayContextWrapper(QueryClientWrapper({ children })),
    })

    act(() => {
      fireEvent.press(getByText(i18n('search.unmatch')))
    })

    await act(() => {
      overlay?.action2?.callback()
    })

    expect(overlay.visible).toBeFalsy()
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
  it('should call showUnmatchedCard when undo is pressed', () => {
    const { getAllByText } = render(
      <UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />,
      {
        wrapper: QueryClientWrapper,
      },
    )

    act(() => {
      fireEvent.press(getAllByText(i18n('search.undo'))[0])
    })

    expect(showUnmatchedCard).toHaveBeenCalled()
  })
  it('should call interruptMatching when undo is pressed', () => {
    const { getAllByText } = render(
      <UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />,
      {
        wrapper: QueryClientWrapper,
      },
    )

    act(() => {
      fireEvent.press(getAllByText(i18n('search.undo'))[0])
    })

    expect(interruptMatching).toHaveBeenCalled()
  })
  it('show the match undone popup when undo is pressed', () => {
    const { getAllByText } = render(
      <UnmatchButton {...defaultProps} match={{ ...defaultProps.match, matched: false }} />,
      {
        wrapper: ({ children }) => OverlayContextWrapper(QueryClientWrapper({ children })),
      },
    )

    act(() => {
      fireEvent.press(getAllByText(i18n('search.undo'))[0])
    })
    const ExpectedContent = appOverlays.matchUndone.content
    expect(overlay).toStrictEqual({
      title: appOverlays.matchUndone.title,
      content: <ExpectedContent />,
      visible: true,
      level: 'APP',
    })
  })
})
