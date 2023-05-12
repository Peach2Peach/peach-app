import { TransactionInMempool } from '../../fundEscrow/components/TransactionInMempool'
import { act, fireEvent, render } from '@testing-library/react-native'

describe('TransactionInMempool', () => {
  // This is to disable the error log for the Image source, which we mock in the test
  jest.spyOn(console, 'error').mockImplementation(() => {})
  it('should render correctly', () => {
    const { toJSON } = render(<TransactionInMempool />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('shoud render correctly with different width', () => {
    const { toJSON, getByTestId } = render(<TransactionInMempool />)
    const imageContainer = getByTestId('image-container')
    act(() => {
      fireEvent(imageContainer, 'onLayout', { nativeEvent: { layout: { width: 100 } } })
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
