import { act, fireEvent, render } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { TransactionInMempool } from './TransactionInMempool'

describe('TransactionInMempool', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<TransactionInMempool txId="txId" />, { wrapper: NavigationWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
  it('shoud render correctly with different width', () => {
    const { toJSON, getByTestId } = render(<TransactionInMempool txId="txId" />, { wrapper: NavigationWrapper })
    const imageContainer = getByTestId('image-container')
    act(() => {
      fireEvent(imageContainer, 'onLayout', { nativeEvent: { layout: { width: 100 } } })
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
