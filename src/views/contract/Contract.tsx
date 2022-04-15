import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import * as bitcoin from 'bitcoinjs-lib'

import LanguageContext from '../../contexts/language'
import { Button, Loading, PeachScrollView, Timer, Title } from '../../components'
import { RouteProp } from '@react-navigation/native'
import getContractEffect from '../../effects/getContractEffect'
import { error } from '../../utils/log'
import { MessageContext } from '../../contexts/message'
import i18n from '../../utils/i18n'
import { getContract, saveContract } from '../../utils/contract'
import { account } from '../../utils/account'
import { confirmPayment } from '../../utils/peachAPI'
import { getOffer } from '../../utils/offer'
import { thousands } from '../../utils/string'
import { TIMERS } from '../../constants'
import { getEscrowWallet, getFinalScript, getNetwork } from '../../utils/wallet'
import ContractDetails from './components/ContractDetails'
import Rate from './components/Rate'
import { verifyPSBT } from './helpers/verifyPSBT'
import { getTimerStart } from './helpers/getTimerStart'
import { decryptSymmetricKey, getPaymentData } from './helpers/parseContract'
import { getRequiredAction } from './helpers/getRequiredAction'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [updatePending, setUpdatePending] = useState(true)
  const [loading, setLoading] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(getContract(contractId))
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setContractId(() => route.params.contractId)
  }, [route])

  useEffect(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')

      const [symmetricKey, err] = contract?.symmetricKey
        ? [contract.symmetricKey, null]
        : await decryptSymmetricKey(
          result.symmetricKeyEncrypted,
          result.symmetricKeySignature,
          result.buyer.pgpPublicKey,
        )

      if (err) error(err)

      saveAndUpdate(contract
        ? {
          ...contract,
          ...result,
          symmetricKey,
          // canceled: contract.canceled
        }
        : {
          ...result,
          symmetricKey,
        }
      )
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId])

  useEffect(() => {
    (async () => {
      if (!contract || !view || contract.canceled) return

      if ((view === 'seller' && contract?.ratingBuyer)
        || (view === 'buyer' && contract?.ratingSeller)) {
        setContractId('')
        navigation.navigate('tradeComplete', { contract, view })
        return
      }

      if (contract.paymentData || !contract.symmetricKey) return

      const [paymentData, err] = await getPaymentData(contract)

      if (err) error(err)
      if (paymentData) {
        // TODO if err is yielded consider open a disput directly
        const contractErrors = contract.contractErrors || []
        if (err) contractErrors.push(err.message)
        saveAndUpdate({
          ...contract,
          paymentData,
          contractErrors,
        })
      }
    })()

    setRequiredAction(getRequiredAction(contract))

    setUpdatePending(false)
  }, [contract])

  const postConfirmPaymentBuyer = async () => {
    if (!contract) return

    const [result, err] = await confirmPayment({ contractId: contract.id })

    if (err) {
      error(err.error)
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentMade: new Date()
    })
  }

  const postConfirmPaymentSeller = async () => {
    if (!contract) return
    setLoading(true)

    const sellOffer = getOffer(contract.id.split('-')[0]) as SellOffer
    if (!sellOffer.id || !sellOffer?.funding) return

    const psbt = bitcoin.Psbt.fromBase64(contract.releaseTransaction, { network: getNetwork() })

    // Don't trust the response, verify
    const errorMsg = verifyPSBT(psbt, sellOffer, contract)

    if (errorMsg.length) {
      setLoading(false)
      updateMessage({
        msg: errorMsg.join('\n'),
        level: 'WARN',
      })
      return
    }

    // Sign psbt
    psbt.signInput(0, getEscrowWallet(sellOffer.id))

    const tx = psbt
      .finalizeInput(0, getFinalScript)
      .extractTransaction()
      .toHex()

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    setLoading(false)

    if (err) {
      error(err.error)
      updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
      return
    }

    saveAndUpdate({
      ...contract,
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || ''
    })
  }

  return updatePending
    ? <Loading />
    : <PeachScrollView style={tw`pt-6 px-6`}>
      <View style={tw`pb-32`}>
        <Title
          title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
          subtitle={contract?.amount ? i18n('contract.subtitle', thousands(contract.amount)) : ''}
        />
        {contract && !contract.paymentConfirmed
          ? <View style={tw`mt-16`}>
            {requiredAction !== 'none'
              ? <Timer
                text={i18n(`contract.timer.${requiredAction}`)}
                start={getTimerStart(contract, requiredAction)}
                duration={TIMERS[requiredAction]}
              />
              : null
            }
            <ContractDetails contract={contract} view={view} />
            <Button
              onPress={() => navigation.navigate('contractChat', { contractId: contract.id })}
              style={tw`mt-4`}
              title={i18n('chat')}
              secondary={true}
            />
            {view === 'buyer' && requiredAction === 'paymentMade'
              ? <Button
                disabled={loading}
                onPress={postConfirmPaymentBuyer}
                style={tw`mt-2`}
                title={i18n('contract.payment.made')}
              />
              : null
            }
            {view === 'seller' && requiredAction === 'paymentConfirmed'
              ? <Button
                disabled={loading}
                onPress={postConfirmPaymentSeller}
                style={tw`mt-2`}
                title={i18n('contract.payment.received')}
              />
              : null
            }
          </View>
          : null
        }
        {contract && contract.paymentConfirmed
          ? <View style={tw`mt-16`}>
            <Rate contract={contract} view={view} navigation={navigation} saveAndUpdate={saveAndUpdate} />
          </View>
          : null
        }
      </View>
    </PeachScrollView>
}