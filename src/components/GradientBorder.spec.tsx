import { render } from 'test-utils'
import tw from '../styles/tailwind'
import { GradientBorder } from './GradientBorder'

describe('GradientBorder', () => {
  const testGradient = [
    { offset: '0%', color: String(tw`text-gradient-yellow`.color), opacity: '1' },
    { offset: '50.25%', color: String(tw`text-gradient-orange`.color), opacity: '1' },
    { offset: '100%', color: String(tw`text-gradient-red`.color), opacity: '1' },
  ]
  it('should render correctly and show border by default', () => {
    const { toJSON } = render(
      <GradientBorder gradientBorderWidths={[2, 1, 0, 0]} defaultBorderWidths={[0, 2, 1, 0]} gradient={testGradient}>
        {<></>}
      </GradientBorder>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly and hide border', () => {
    const { toJSON } = render(
      <GradientBorder
        gradientBorderWidths={[2, 1, 0, 0]}
        defaultBorderWidths={[0, 2, 1, 0]}
        gradient={testGradient}
        showBorder={false}
      >
        {<></>}
      </GradientBorder>,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
