import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import { Button, Headline, Text } from '../../components'
import { MessageContext } from '../../contexts/message'
import { useUserDataStore } from '../../store'
import tw from '../../styles/tailwind'
import { signReleaseTx } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error } from '../../utils/log'
import { confirmPayment } from '../../utils/peachAPI'

type DisputeLostSellerProps = {
  contract: Contract
  navigate: () => void
}

export const DisputeLostSeller = ({ contract, navigate }: DisputeLostSellerProps): ReactElement => {
  const [, updateMessage] = useContext(MessageContext)
  const { setContract } = useUserDataStore(
    (state) => ({
      setContract: state.setContract,
    }),
    shallow,
  )
  const [loading, setLoading] = useState(false)

  const closeOverlay = () => {
    setContract({
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
      updateMessage({ msgKey: errorMsg!.join('\n'), level: 'WARN' })
      return
    }

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({ msgKey: err.error || 'error.general', level: 'ERROR' })
      return
    }

    setContract({
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
          {!contract.paymentConfirmed ? (
            <Text style={tw`text-white-1 text-center mt-2`}>{i18n('dispute.seller.lost.text.2')}</Text>
          ) : null}
        </View>
        <Button
          style={tw`mt-5`}
          title={i18n(contract.paymentConfirmed ? 'close' : 'dispute.seller.lost.button')}
          secondary={true}
          wide={false}
          onPress={contract.paymentConfirmed ? closeOverlay : release}
          loading={loading}
        />
      </View>
    </View>
  )
}
