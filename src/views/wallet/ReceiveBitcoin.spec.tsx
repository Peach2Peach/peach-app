import { render } from '@testing-library/react-native'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { ReceiveBitcoin } from './ReceiveBitcoin'

jest.useFakeTimers()

describe('ReceiveBitcoin', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<ReceiveBitcoin />, { wrapper: QueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
