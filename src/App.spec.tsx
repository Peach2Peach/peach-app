/**
 * @format
 */

import 'react-native'
import App from './App'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

jest.useFakeTimers()

describe('App', () => {
  it.skip('renders correctly', async () => {
    renderer.create(<App />)
  })
})
