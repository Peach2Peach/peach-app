import { render } from '@testing-library/react-native'
import { SummaryItem } from './SummaryItem'

describe('SummaryItem', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<SummaryItem label={'reference'} value={<SummaryItem.NoReference />} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
