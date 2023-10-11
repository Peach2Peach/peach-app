import { Text, View } from 'react-native'
import { render } from 'test-utils'
import { ConditionalWrapper } from './ConditionalWrapper'

describe('ConditionalWrapper', () => {
  it('should apply wrapper when condition is true', () => {
    const { toJSON } = render(
      <ConditionalWrapper
        condition={true}
        wrapper={(children) => <View style={{ backgroundColor: '#000000' }}>{children}</View>}
      >
        <Text>test</Text>
      </ConditionalWrapper>,
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('should not apply wrapper when condition is false', () => {
    const { toJSON } = render(
      <ConditionalWrapper
        condition={false}
        wrapper={(children) => <View style={{ backgroundColor: '#000000' }}>{children}</View>}
      >
        <Text>test</Text>
      </ConditionalWrapper>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
