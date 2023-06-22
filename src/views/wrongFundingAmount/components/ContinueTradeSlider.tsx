import { ConfirmSlider } from '../../../components/inputs'
import i18n from '../../../utils/i18n'

type Props = {
  onConfirm: () => void
}
export const ContinueTradeSlider = ({ onConfirm }: Props) => (
  <ConfirmSlider onConfirm={onConfirm} label1={i18n('continueTrade')} iconId="arrowRightCircle" />
)
