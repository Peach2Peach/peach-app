import { Divider } from '../../../components/Divider'
import { Icon } from '../../../components/Icon'
import tw from '../../../styles/tailwind'
import { useContractContext } from '../context'
import { getTradeSeparatorIcon, getTradeSeparatorIconColor, getTradeSeparatorText } from '../helpers'

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
