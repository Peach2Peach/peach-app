import { PopupComponent } from './PopupComponent'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { PopupAction } from './PopupAction'
import tw from '../../styles/tailwind'

describe('PopupComponent', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <PopupComponent
        content={<Text>content</Text>}
        actions={<PopupAction onPress={jest.fn()} label="label" iconId="bitcoinLogo" style={tw`items-center`} />}
      />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
