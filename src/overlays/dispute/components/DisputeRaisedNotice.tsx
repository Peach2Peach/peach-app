import React, { ReactElement, useContext, useState } from 'react'
import { Text, View } from 'react-native'
import { Input } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { contractIdToHex } from '../../../utils/contract'
import i18n from '../../../utils/i18n'
import { info } from '../../../utils/log'
import { isEmailRequired } from '../../../views/dispute/DisputeForm'

declare type DisputeRaisedNoticeProps = {
  contract: Contract
  view: ContractViewer
  disputeReason: DisputeReason
  submit: Function
  email: string
  setEmail: Function
  emailErrors: string[] | undefined
}

export default ({
  contract,
  view,
  disputeReason,
  submit,
  email,
  setEmail,
  emailErrors,
}: DisputeRaisedNoticeProps): ReactElement => {
  const [displayErrors, setDisplayErrors] = useState(false)

  const [, updateOverlay] = useContext(OverlayContext)
  const navigation = useNavigation()

  const closeOverlay = () => {
    updateOverlay({ visible: false })
  }

  info('reset')
  return (
    <>
      <Text style={tw`mb-3 body-m text-black-1`}>
        {isEmailRequired(disputeReason)
          ? view === 'seller'
            ? i18n(
              'dispute.opened.counterparty.text.1.withEmail.seller',
              i18n(view),
              contractIdToHex(contract.id),
              contract.amount.toString(),
            )
            : i18n(
              'dispute.opened.counterparty.text.1.withEmail.buyer',
              i18n(view),
              contractIdToHex(contract.id),
              contract.amount.toString(),
            )
          : i18n(
            'dispute.opened.counterparty.text.1.withoutEmail',
            i18n(view),
            contractIdToHex(contract.id),
            contract.amount.toString(),
          )}
      </Text>
      <Text style={tw`body-m text-black-1`}>
        {isEmailRequired(disputeReason)
          ? i18n('dispute.opened.counterparty.text.2.withEmail')
          : i18n('dispute.opened.counterparty.text.2.withoutEmail')}
      </Text>

      {isEmailRequired(disputeReason) && (
        <View style={tw`mt-4`}>
          <Input
            style={tw`bg-warning-background`}
            onChange={setEmail}
            onSubmit={() => {
              submit(contract, contract.disputeReason)
            }}
            value={email}
            placeholder={i18n('form.email.placeholder')}
            autoCorrect={false}
            errorMessage={emailErrors}
          />
        </View>
      )}
    </>
  )
}
