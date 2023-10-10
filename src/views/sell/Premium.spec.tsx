import { createRenderer } from 'react-test-renderer/shallow'
import { PrimaryButton } from '../../components'
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
          <PrimaryButton
            disabled={true}
            narrow={true}
            onPress={jest.fn()}
            style={{
              alignSelf: 'center',
              marginBottom: 20,
            }}
          >
            {'next'}
          </PrimaryButton>
        }
        amount={21000000}
      />,
    )
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
