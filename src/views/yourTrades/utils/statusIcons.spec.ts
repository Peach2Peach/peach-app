import { statusIcons } from './statusIcons'
import Icons from '../../../assets/icons'

describe('statusIcons', () => {
  const icons = Object.keys(Icons)
  it('should return proper status icon map', () => {
    expect(statusIcons).toBeInstanceOf(Object)
    Object.values(statusIcons).forEach((icon) => expect(icons.indexOf(icon)).toBeGreaterThanOrEqual(0))
  })
})
