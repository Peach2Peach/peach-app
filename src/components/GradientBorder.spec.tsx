import { render } from 'test-utils'
import { GradientBorder } from './GradientBorder'

describe('GradientBorder', () => {
  it('should render correctly and show border by default', () => {
    const { toJSON } = render(<GradientBorder gradientBorderWidth={2}>{<></>}</GradientBorder>)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly and hide border', () => {
    const { toJSON } = render(
      <GradientBorder gradientBorderWidth={2} showBorder={false}>
        {<></>}
      </GradientBorder>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
