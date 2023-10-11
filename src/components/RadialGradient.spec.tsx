import { render } from 'test-utils'
import { RadialGradient } from './RadialGradient'

describe('RadialGradient', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <RadialGradient
        colorList={[
          { offset: '0%', color: 'red', opacity: '1' },
          { offset: '50.25%', color: 'green', opacity: '1' },
          { offset: '100%', color: 'blue', opacity: '1' },
        ]}
        x="50%"
        y="50%"
        rx="50%"
        ry="50%"
      />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
