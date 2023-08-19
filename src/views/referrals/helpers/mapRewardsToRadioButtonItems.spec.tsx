import { mapRewardsToRadioButtonItems } from './mapRewardsToRadioButtonItems'

describe('mapRewardsToRadioButtonItems', () => {
  it('maps rewards to radio button items', () => {
    expect(mapRewardsToRadioButtonItems(0)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(100)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(200)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(300)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(400)).toMatchSnapshot()
  })
})
