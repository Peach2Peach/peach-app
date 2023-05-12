import { SlideToUnlock } from '../../../components/inputs'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type Props = {
  onUnlock: () => void
}
export const ContinueTradeSlider = ({ onUnlock }: Props) => (
  <SlideToUnlock style={tw`w-[263px]`} onUnlock={onUnlock} label1={i18n('continueTrade')} iconId="arrowRightCircle" />
)
