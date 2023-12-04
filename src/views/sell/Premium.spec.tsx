import { createRenderer } from 'react-test-renderer/shallow'
import { Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { priceFormat } from '../../utils/string'
import { Premium } from './Premium'

jest.mock('../../hooks', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))

jest.useFakeTimers({ now: new Date('2022-02-14T12:00:00.000Z') })

describe('Premium', () => {
  const renderer = createRenderer()

  it('should render the Premium view', () => {
    renderer.render(
      <Premium
        premium={1.5}
        setPremium={jest.fn()}
        offerPrice={
          <Text style={tw`text-center text-black-2`}>
            ({i18n('sell.premium.currently', `${priceFormat(21)} ${'EUR'}`)})
          </Text>
        }
        confirmButton={
          <Button style={tw`self-center`} disabled onPress={jest.fn()}>
            {'next'}
          </Button>
        }
        amount={21000000}
      />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
