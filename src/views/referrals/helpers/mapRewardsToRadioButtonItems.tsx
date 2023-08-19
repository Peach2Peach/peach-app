import { RadioButtonItem } from '../../../components/inputs/RadioButtons'
import { RewardItem } from '../components/RewardItem'
import { REWARDINFO } from '../constants'
import { isRewardAvailable } from './isRewardAvailable'

export const mapRewardsToRadioButtonItems = (balance: number): RadioButtonItem<RewardType>[] =>
  REWARDINFO.map((reward) => ({
    value: reward.id,
    disabled: !isRewardAvailable(reward, balance),
    display: <RewardItem reward={reward} />,
  }))
