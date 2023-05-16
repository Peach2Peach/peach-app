import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Divider } from '../Divider'
import { useContractContext } from '../../views/contract/context'
import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'
import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'
import { getTradeSeparatorText } from './getTradeSeparatorText'

export const TradeSeparator = ({ style }: ComponentProps) => {
  const { contract, view } = useContractContext()
  const { disputeActive, disputeWinner } = contract
  const iconId = getTradeSeparatorIcon(contract, view)
  const iconColor = getTradeSeparatorIconColor(view, disputeWinner)
  const text = getTradeSeparatorText(contract, view)
  return (
    <Divider
      type={disputeActive ? 'error' : 'light'}
      text={text}
      icon={iconId ? <Icon id={iconId} style={tw`w-4 h-4 mr-1`} color={iconColor} /> : undefined}
      style={style}
    />
  )
}
