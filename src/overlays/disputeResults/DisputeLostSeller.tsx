import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import { Headline, PrimaryButton, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import { saveContract, signReleaseTx } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { confirmPayment } from '../../utils/peachAPI'

type DisputeLostSellerProps = {
  contract: Contract
  navigate: () => void
}

export const DisputeLostSeller = ({ contract, navigate }: DisputeLostSellerProps): ReactElement => {
  const navigation = useNavigation()
  const [, updateMessage] = useContext(MessageContext)

  const [loading, setLoading] = useState(false)

  const closeOverlay = () => {
    saveContract({
      ...contract,
      disputeResultAcknowledged: true,
      cancelConfirmationDismissed: true,
    })
    navigate()
  }
  const release = async () => {
    setLoading(true)

    const [tx, errorMsg] = signReleaseTx(contract)
    if (!tx) {
      setLoading(false)
      updateMessage({
        msgKey: errorMsg || 'GENERAL_ERROR',
        level: 'WARN',
        action: () => navigation.navigate('contact'),
        actionLabel: i18n('contactUs'),
        actionIcon: 'mail',
      })
      return
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({
        msgKey: err.error || 'GENERAL_ERROR',
        level: 'ERROR',
        action: () => navigation.navigate('contact'),
        actionLabel: i18n('contactUs'),
        actionIcon: 'mail',
      })
      return
    }

    saveContract({
      ...contract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
      disputeResultAcknowledged: true,
    })
    navigate()
  }

  return (
    <View style={tw`px-6`}>
      <Headline style={tw`text-3xl leading-3xl text-white-1`}>{i18n('dispute.lost')}</Headline>
      <View style={tw`flex justify-center items-center`}>
        <View style={tw`flex justify-center items-center`}>
          <Text style={tw`text-white-1 text-center`}>{i18n('dispute.seller.lost.text.1')}</Text>
          {!contract.paymentConfirmed && (
            <Text style={tw`text-white-1 text-center mt-2`}>{i18n('dispute.seller.lost.text.2')}</Text>
          )}
        </View>
        <PrimaryButton
          style={tw`mt-5`}
          onPress={contract.paymentConfirmed ? closeOverlay : release}
          loading={loading}
          narrow
        >
          {i18n(contract.paymentConfirmed ? 'close' : 'dispute.seller.lost.button')}
        </PrimaryButton>
      </View>
    </View>
  )
}
