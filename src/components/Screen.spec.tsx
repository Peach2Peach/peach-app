import { Screen } from './Screen'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'
import { mockDimensions } from '../../tests/unit/helpers/mockDimensions'

describe('Screen', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <Screen>
        <View />
      </Screen>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly on small screens', () => {
    mockDimensions({ width: 320, height: 480 })
    const { toJSON } = render(
      <Screen>
        <View />
      </Screen>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
