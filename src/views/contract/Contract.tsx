import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import * as bitcoin from 'bitcoinjs-lib'

import LanguageContext from '../../contexts/language'
import { Button, Icon, Loading, PeachScrollView, SatsFormat, Text, Timer, Title } from '../../components'
import { RouteProp, useFocusEffect } from '@react-navigation/native'
import getContractEffect from '../../effects/getContractEffect'
import { error } from '../../utils/log'
import { MessageContext } from '../../contexts/message'
import i18n from '../../utils/i18n'
import { contractIdToHex, getContract, saveContract } from '../../utils/contract'
import { account } from '../../utils/account'
import { confirmPayment } from '../../utils/peachAPI'
import { getOffer } from '../../utils/offer'
import { TIMERS } from '../../constants'
import { getEscrowWallet, getFinalScript, getNetwork } from '../../utils/wallet'
import { verifyPSBT } from './helpers/verifyPSBT'
import { getTimerStart } from './helpers/getTimerStart'
import { decryptSymmetricKey, getPaymentData } from './helpers/parseContract'
import { getRequiredAction } from './helpers/getRequiredAction'
import { ContractSummary } from '../offers/components/ContractSummary'
import { isTradeComplete } from '../../utils/offer/getOfferStatus'
import YouGotADispute from '../../overlays/YouGotADispute'
import { OverlayContext } from '../../contexts/overlay'
import Payment from '../../overlays/info/Payment'
import ConfirmPayment from '../../overlays/info/ConfirmPayment'

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
  const [, updateOverlay] = useContext(OverlayContext)
  const [, updateMessage] = useContext(MessageContext)

  const [updatePending, setUpdatePending] = useState(true)
  const [loading, setLoading] = useState(false)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(() => getContract(contractId))
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  useEffect(() => {
    setUpdatePending(true)
    setContractId(() => route.params.contractId)
  }, [route])

  useFocusEffect(useCallback(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')

      const [symmetricKey, err] = !contract?.symmetricKey ? await decryptSymmetricKey(
        result.symmetricKeyEncrypted,
        result.symmetricKeySignature,
        result.buyer.pgpPublicKey,
      ) : [contract?.symmetricKey, null]

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

      if (result.disputeActive
        && result.disputeInitiator !== account.publicKey
        && !result.disputeAcknowledgedByCounterParty) {
        updateOverlay({
          content: <YouGotADispute
            contractId={result.id}
            message={result.disputeClaim as string}
            navigation={navigation} />,
          showCloseButton: false
        })
      }
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId]))

  useEffect(() => {
    if (!contract || !view || contract.canceled) return

    if (isTradeComplete(contract)) {
      navigation.replace('tradeComplete', { contract })
      return
    }

    if (contract.paymentData || !contract.symmetricKey) {
      setRequiredAction(getRequiredAction(contract))
      setUpdatePending(false)
      return
    }

    (async () => {
      const [paymentData, err] = await getPaymentData(contract)

      if (err) error(err)
      if (paymentData) {
        // TODO if err is yielded consider open a disput directly
        const contractErrors = contract.contractErrors || []
        if (err) contractErrors.push(err.message)
        saveAndUpdate({
          ...contract,
          paymentData,
          contractErrors,
        })
      }

      setRequiredAction(getRequiredAction(contract))
      setUpdatePending(false)
    })()
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
    psbt.txInputs.forEach((input, i) =>
      psbt
        .signInput(i, getEscrowWallet(sellOffer.id!))
        .finalizeInput(i, getFinalScript)
    )

    const tx = psbt
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

  const openPaymentHelp = () => updateOverlay({
    content: <Payment />,
    showCloseButton: true, help: true
  })
  const openConfirmPaymentHelp = () => updateOverlay({
    content: <ConfirmPayment />,
    showCloseButton: true, help: true
  })

  return !contract || updatePending
    ? <Loading />
    : <PeachScrollView style={tw`pt-6`} contentContainerStyle={tw`px-6`}>
      <View style={tw`pb-32`}>
        <Title
          title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
        />
        <Text style={tw`text-grey-2 text-center -mt-1`}>
          {i18n('contract.subtitle')} <SatsFormat sats={contract.amount}
            color={tw`text-grey-2`}
          />
        </Text>
        <Text style={tw`text-center text-grey-2 mt-2`}>{i18n('contract.trade', contractIdToHex(contract.id))}</Text>
        {!contract.paymentConfirmed
          ? <View style={tw`mt-16`}>
            <ContractSummary contract={contract} view={view} navigation={navigation} />
            <View style={tw`mt-16 flex-row justify-center`}>
              {(view === 'buyer' && requiredAction === 'paymentMade')
              || (view === 'seller' && requiredAction === 'paymentConfirmed')
                ? <View style={tw`absolute bottom-full mb-1 flex-row items-center`}>
                  <Timer
                    text={i18n(`contract.timer.${requiredAction}`)}
                    start={getTimerStart(contract, requiredAction)}
                    duration={TIMERS[requiredAction]}
                    style={tw`flex-shrink`}
                  />
                  {requiredAction === 'paymentMade'
                    ? <Pressable onPress={openPaymentHelp} style={tw`flex-row items-center p-1 -mt-0.5`}>
                      <Icon id="help" style={tw`w-4 h-4`} color={tw`text-blue-1`.color as string} />
                    </Pressable>
                    : null
                  }
                </View>
                : null
              }
              {!(view === 'buyer' && requiredAction === 'paymentMade')
              && !(view === 'seller' && requiredAction === 'paymentConfirmed')
                ? <Button
                  disabled={true}
                  wide={false}
                  style={tw`w-52`}
                  title={i18n(`contract.waitingFor.${view === 'buyer' ? 'seller' : 'buyer'}`)}
                />
                : null
              }
              {view === 'buyer' && requiredAction === 'paymentMade'
                ? <Button
                  disabled={loading}
                  wide={false}
                  style={tw`w-52`}
                  onPress={postConfirmPaymentBuyer}
                  title={i18n('contract.payment.made')}
                />
                : null
              }
              {view === 'seller' && requiredAction === 'paymentConfirmed'
                ? <View style={tw`flex-row items-center justify-center`}>
                  <Button
                    disabled={loading}
                    wide={false}
                    onPress={postConfirmPaymentSeller}
                    style={tw`w-52`}
                    title={i18n('contract.payment.received')}
                  />
                  <Pressable onPress={openConfirmPaymentHelp} style={tw`w-0 h-full flex-row items-center`}>
                    <Icon id="help" style={tw`ml-2 w-5 h-5`} color={tw`text-blue-1`.color as string} />
                  </Pressable>
                </View>
                : null
              }
            </View>
          </View>
          : null
        }
      </View>
    </PeachScrollView>
}