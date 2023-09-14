import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { NavigationAndQueryClientWrapper } from '../../../tests/unit/helpers/NavigationAndQueryClientWrapper'
import { navigateMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { YourTrades } from './YourTrades'

jest.useFakeTimers()

jest.mock('../../hooks/useRoute', () => ({
  useRoute: jest.fn(() => ({
    params: {
      tab: 'buy',
    },
  })),
}))

describe('YourTrades', () => {
  const wrapper = NavigationAndQueryClientWrapper
  it('should render correctly', async () => {
    const { toJSON } = render(<YourTrades />, { wrapper })
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0)
    })
    expect(toJSON()).toMatchSnapshot()
  })

  it('should navigate to "exportTradeHistory" when clicking on the icon in the header', () => {
    const { getByAccessibilityHint } = render(<YourTrades />, { wrapper })
    const icon = getByAccessibilityHint('go to export trade history')
    fireEvent.press(icon)

    expect(navigateMock).toHaveBeenCalledWith('exportTradeHistory')
  })
})