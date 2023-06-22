import { ConfirmSlider } from '../../../components/inputs'
import i18n from '../../../utils/i18n'

type Props = {
  onUnlock: () => void
}
export const ContinueTradeSlider = ({ onUnlock }: Props) => (
  <ConfirmSlider onUnlock={onUnlock} label1={i18n('continueTrade')} iconId="arrowRightCircle" />
)
