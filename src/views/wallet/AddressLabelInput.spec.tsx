import { render } from '@testing-library/react-native'
import { QueryClientWrapper } from '../../../tests/unit/helpers/QueryClientWrapper'
import { AddressLabelInput } from './AddressLabelInput'

describe('AddressLabelInput', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<AddressLabelInput index={1} />, { wrapper: QueryClientWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})
