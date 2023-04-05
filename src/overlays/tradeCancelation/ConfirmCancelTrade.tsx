import { ReactElement } from 'react'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

declare type Props = {
  contract: Contract
  view: ContractViewer
}

export const ConfirmCancelTrade = ({ contract, view }: Props): ReactElement => (
  <>
    <Text style={tw`body-m`}>{i18n('contract.cancel.text')}</Text>
    {view === 'buyer'
    {(view === 'buyer' || !contract.paymentMethod.startsWith('cash.')) && (
      <Text style={tw`mt-3 body-m`}>{i18n(`contract.cancel.${view}`)}</Text>
    )}
  </>
)
