import PeachText from '../../components/text/Text'
import i18n from '../../utils/i18n'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'

type Props = {
  contract: Contract
  view: ContractViewer
}

export const ConfirmCancelTrade = ({ contract, view }: Props) => {
  const isCash = isCashTrade(contract.paymentMethod)
  return <PeachText>{i18n(isCash ? 'contract.cancel.cash.text' : `contract.cancel.${view}`)}</PeachText>
}
