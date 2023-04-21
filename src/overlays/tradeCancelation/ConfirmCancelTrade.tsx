import { ReactElement } from 'react'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { isCashTrade } from '../../utils/paymentMethod/isCashTrade'

declare type Props = {
  contract: Contract
  view: ContractViewer
}

export const ConfirmCancelTrade = ({ contract, view }: Props): ReactElement => {
  const show2ndText = view === 'buyer' || !isCashTrade(contract.paymentMethod)
  return (
    <>
      <Text style={tw`body-m`}>{i18n('contract.cancel.text')}</Text>
      {show2ndText && <Text style={tw`body-m mt-3`}>{i18n(`contract.cancel.${view}`)}</Text>}
    </>
  )
}
