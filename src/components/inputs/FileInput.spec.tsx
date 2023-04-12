import { FileInput } from './FileInput'
import { render } from '@testing-library/react-native'

jest.mock('./Input', () => 'Input')

describe('FileInput', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<FileInput />)
    expect(toJSON()).toMatchSnapshot()
  })
})
