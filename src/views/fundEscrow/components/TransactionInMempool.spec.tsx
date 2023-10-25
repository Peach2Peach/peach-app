import { act, fireEvent, render } from 'test-utils'
import { TransactionInMempool } from './TransactionInMempool'

describe('TransactionInMempool', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<TransactionInMempool txId="txId" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('shoud render correctly with different width', () => {
    const { toJSON, getByTestId } = render(<TransactionInMempool txId="txId" />)
    const imageContainer = getByTestId('image-container')
    act(() => {
      fireEvent(imageContainer, 'onLayout', { nativeEvent: { layout: { width: 100 } } })
    })
    expect(toJSON()).toMatchSnapshot()
  })
})
