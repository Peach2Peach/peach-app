import { toMatchDiffSnapshot } from 'snapshot-diff'
import { act, fireEvent, render, waitFor } from 'test-utils'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { AddressNavigation } from './AddressNavigation'
expect.extend({ toMatchDiffSnapshot })

jest.useFakeTimers()

describe('AddressNavigation', () => {
  beforeAll(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
    queryClient.clear()
  })

  const getLastUnusedAddressMock = jest.fn().mockResolvedValue({
    address: 'bcrt1qj9yqz9qzg9qz9qz9qz9qz9qz9qz9qz9qz9qz9',
    index: 5,
  })

  it('should render correctly', () => {
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock
    const { toJSON } = render(<AddressNavigation index={1} setIndex={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should update the index when the user clicks on the arrows', () => {
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock
    const setIndexMock = jest.fn()
    const { UNSAFE_getByProps } = render(<AddressNavigation index={1} setIndex={setIndexMock} />)
    const leftArrow = UNSAFE_getByProps({ id: 'arrowLeftCircle' })
    const rightArrow = UNSAFE_getByProps({ id: 'arrowRightCircle' })

    act(() => {
      fireEvent.press(leftArrow)
    })
    expect(setIndexMock).toHaveBeenCalledWith(0)

    act(() => {
      fireEvent.press(rightArrow)
    })
    expect(setIndexMock).toHaveBeenCalledWith(2)
  })
  it('should go to the last unused address when the user clicks on the chevrons', () => {
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock
    const setIndexMock = jest.fn()
    const { UNSAFE_getByProps, rerender } = render(<AddressNavigation index={10} setIndex={setIndexMock} />)
    const leftChevron = UNSAFE_getByProps({ id: 'chevronsLeft' })

    act(() => {
      fireEvent.press(leftChevron)
    })
    expect(setIndexMock).toHaveBeenCalledWith(5)

    rerender(<AddressNavigation index={0} setIndex={setIndexMock} />)
    const rightChevron = UNSAFE_getByProps({ id: 'chevronsRight' })
    act(() => {
      fireEvent.press(rightChevron)
    })
    expect(setIndexMock).toHaveBeenCalledWith(5)
  })
  it('should prefetch the next address when the user clicks on the right arrow', async () => {
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock
    peachWallet.getAddressByIndex = jest.fn((index) =>
      Promise.resolve({ address: `address-${index}`, index, used: false }),
    )

    const { UNSAFE_getByProps } = render(<AddressNavigation index={1} setIndex={jest.fn()} />)
    const rightArrow = UNSAFE_getByProps({ id: 'arrowRightCircle' })
    act(() => {
      fireEvent.press(rightArrow)
    })

    await waitFor(() => {
      expect(queryClient.getQueryData(['receiveAddress', 3])).toStrictEqual({
        address: 'address-3',
        index: 3,
        used: false,
      })
    })
  })
  it('should prefetch the previous address when the user clicks on the left arrow', async () => {
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock
    peachWallet.getAddressByIndex = jest.fn((index) =>
      Promise.resolve({ address: `address-${index}`, index, used: false }),
    )

    const { UNSAFE_getByProps } = render(<AddressNavigation index={3} setIndex={jest.fn()} />)
    const leftArrow = UNSAFE_getByProps({ id: 'arrowLeftCircle' })
    act(() => {
      fireEvent.press(leftArrow)
    })

    await waitFor(() => {
      expect(queryClient.getQueryData(['receiveAddress', 1])).toStrictEqual({
        address: 'address-1',
        index: 1,
        used: false,
      })
    })
  })
  it('should only show the chevrons when the user is more than 2 addresses away from the last unused address', () => {
    peachWallet.getLastUnusedAddress = getLastUnusedAddressMock
    const { toJSON, rerender } = render(<AddressNavigation index={5} setIndex={jest.fn()} />)
    const withoutChevrons = toJSON()

    rerender(<AddressNavigation index={3} setIndex={jest.fn()} />)
    const withChevronsLeft = toJSON()

    rerender(<AddressNavigation index={7} setIndex={jest.fn()} />)
    const withChevronsRight = toJSON()

    expect(withoutChevrons).toMatchDiffSnapshot(withChevronsLeft)
    expect(withoutChevrons).toMatchDiffSnapshot(withChevronsRight)
  })
})
