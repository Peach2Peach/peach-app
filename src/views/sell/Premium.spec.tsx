import { createRenderer } from 'react-test-renderer/shallow'
import { Button } from '../../components/buttons/Button'
import tw from '../../styles/tailwind'
import { Premium } from './Premium'
import { CurrentOfferPrice } from './components'

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
        offerPrice={<CurrentOfferPrice />}
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
