import { GradientBorder } from './GradientBorder'
import { render } from '@testing-library/react-native'
import tw from '../styles/tailwind'

describe('GradientBorder', () => {
  const testGradient = [
    { offset: '0%', color: String(tw.color('gradient-yellow')), opacity: '1' },
    { offset: '50.25%', color: String(tw.color('gradient-orange')), opacity: '1' },
    { offset: '100%', color: String(tw.color('gradient-red')), opacity: '1' },
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
