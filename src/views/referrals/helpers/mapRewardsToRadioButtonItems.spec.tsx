import { REWARDINFO } from '../constants'
import { mapRewardsToRadioButtonItems } from './mapRewardsToRadioButtonItems'

describe('mapRewardsToRadioButtonItems', () => {
  it('maps rewards to radio button items', () => {
    expect(mapRewardsToRadioButtonItems(0)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(REWARDINFO[0].requiredPoints)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(REWARDINFO[1].requiredPoints)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(REWARDINFO[2].requiredPoints)).toMatchSnapshot()
    expect(mapRewardsToRadioButtonItems(REWARDINFO[2].requiredPoints + 1)).toMatchSnapshot()
  })
})
