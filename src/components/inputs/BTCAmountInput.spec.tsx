import { render } from 'test-utils'
import tw from '../../styles/tailwind'
import { BTCAmountInput } from './BTCAmountInput'

describe('BTCAmountInput', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <BTCAmountInput
        value="0"
        onChangeText={jest.fn()}
        size="medium"
        textStyle={tw`absolute w-full py-0 opacity-0 grow h-38px input-text`}
        containerStyle={[
          tw`self-stretch justify-center px-2 py-3 overflow-hidden h-38px rounded-xl`,
          tw`border bg-primary-background-light border-black-65`,
        ]}
      />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
