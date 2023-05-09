import { renderHook, waitFor } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { QueryClientWrapper } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useHeaderState } from '../../../components/header/store'
import { OfferDetailsTitle } from '../../offerDetails/components/OfferDetailsTitle'
import { useSearchSetup } from './useSearchSetup'

const offerId = sellOffer.id
const useRouteMock = jest.fn(() => ({
  params: {
    offerId,
  },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const getOfferDetailsMock = jest.fn().mockResolvedValue([sellOffer])
jest.mock('../../../utils/peachAPI', () => ({
  getOfferDetails: () => getOfferDetailsMock(),
}))

const wrapper = ({ children }: ComponentProps) => (
  <NavigationWrapper>
    <QueryClientWrapper>{children}</QueryClientWrapper>
  </NavigationWrapper>
)

jest.useFakeTimers()

describe('useSearchSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set up header correctly', async () => {
    const { result } = renderHook(useSearchSetup, { wrapper })

    await waitFor(() => expect(result.current.offer).toBeDefined())

    expect(useHeaderState.getState().titleComponent?.type).toEqual(OfferDetailsTitle)
    expect(useHeaderState.getState().titleComponent?.props).toEqual({ id: sellOffer.id })
    expect(useHeaderState.getState().icons?.[0].id).toBe('xCircle')
  })
})
