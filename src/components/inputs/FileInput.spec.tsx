import { render } from '@testing-library/react-native'
import { FileInput } from './FileInput'

jest.mock('./Input', () => 'Input')

describe('FileInput', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<FileInput />)
    expect(toJSON()).toMatchSnapshot()
  })
})
