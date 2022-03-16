import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import * as bitcoin from 'bitcoinjs-lib'


import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Loading, Timer, Title } from '../../components'
import { RouteProp } from '@react-navigation/native'
import getContractEffect from './effects/getContractEffect'
import { error, info } from '../../utils/log'
import { MessageContext } from '../../utils/message'
import i18n from '../../utils/i18n'
import { getContract, saveContract } from '../../utils/contract'
import { account } from '../../utils/account'
import { confirmPayment } from '../../utils/peachAPI'
import { getOffer } from '../../utils/offer'
import { decrypt, verify } from '../../utils/pgp'
import { thousands } from '../../utils/string'
import { TIMERS } from '../../constants'
import { getEscrowWallet, getFinalScript, getNetwork } from '../../utils/wallet'
import { reverseBuffer } from '../../utils/crypto'
import ContractDetails from './components/ContractDetails'
import Rate from './components/Rate'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp,
}

/**
 * @description Method to determine start time for current timer
 * @param contract contract
 * @param requiredAction action required
 * @returns start time of timer
 */
const getTimerStart = (contract: Contract, requiredAction: ContractAction): number => {
  let start = contract.creationDate

  if (requiredAction === 'kycResponse') {
    start = contract.creationDate
  } else if (requiredAction === 'paymentMade') {
    start = contract.kycRequired && contract.kycResponseDate
      ? contract.kycResponseDate
      : contract.creationDate
  } else if (requiredAction === 'paymentConfirmed' && contract.paymentMade) {
    start = contract.paymentMade
  }

  return start.getTime()
}

// TODO check offer status (escrow, searching, matched, online/offline, what else?)
// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  const [updatePending, setUpdatePending] = useState(true)
  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(getContract(contractId))
  const [view, setView] = useState<'seller'|'buyer'|''>('')
  const [requiredAction, setRequiredAction] = useState<ContractAction>('none')

  const saveAndUpdate = (contractData: Contract) => {
    if (typeof contractData.creationDate === 'string') contractData.creationDate = new Date(contractData.creationDate)

    setContract(() => contractData)
    saveContract(contractData)
  }

  const parseContractForBuyer = async (
    updatedContract: Contract,
    response: GetContractResponse
  ): Promise<Contract> => {
    let decryptedPaymentData: PaymentData

    if (!response.paymentData || !response.paymentDataSignature) return response

    try {
      const decryptedPaymentDataString = await decrypt(response.paymentData)
      decryptedPaymentData = JSON.parse(decryptedPaymentDataString)

      if (!await verify(response.paymentDataSignature, decryptedPaymentDataString, response.seller.pgpPublicKey)) {
        // TODO at this point we should probably cancel the order?
        throw new Error('Signature of payment data could not be verified')
      }
    } catch (err) {
      error(err, response.paymentData)
      updateMessage({
        msg: i18n('error.invalidPaymentData'),
        level: 'ERROR',
      })
      return updatedContract
    }
    return {
      ...response,
      paymentData: decryptedPaymentData
    }
  }

  const parseContractForSeller = (updatedContract: Contract): Contract => {
    const sellOffer = getOffer(updatedContract.id.split('-')[0]) as SellOffer
    const paymentData = sellOffer.paymentData.find(data => data.type === updatedContract.paymentMethod)

    return { ...updatedContract, paymentData }
  }

  useEffect(() => {
    setContractId(() => route.params.contractId)
  }, [route])

  useEffect(getContractEffect({
    contractId,
    onSuccess: async (result) => {
      // info('Got contract', result)
      let updatedContract: Contract = contract ? { ...contract, ...result } : result

      console.log('RESULT', result)
      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')

      if (typeof contract?.paymentData === 'object') {
        updatedContract = {
          ...contract,
          ...result,
          paymentData: contract.paymentData
        }
      }

      if (view === 'buyer') {
        saveAndUpdate(await parseContractForBuyer(updatedContract, result))
      } else if (view === 'seller') {
        saveAndUpdate(parseContractForSeller(updatedContract))
      }
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId])

  useEffect(() => {
    if (!contract) return

    if (contract.kycRequired && !contract.kycConfirmed) {
      setRequiredAction('kycResponse')
    } else if (!contract.paymentMade) {
      setRequiredAction('paymentMade')
    } else if (contract.paymentMade && !contract.paymentConfirmed) {
      setRequiredAction('paymentConfirmed')
    }
    setUpdatePending(false)
  }, [contract])

  const postConfirmPaymentBuyer = async () => {
    if (!contract) return

    const [result, err] = await confirmPayment({ contractId: contract.id })

    if (err) {
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
    const sellOffer = getOffer(contract.id.split('-')[0]) as SellOffer
    if (!sellOffer.id || !sellOffer?.funding) return

    const errorMsg = []

    const psbt = bitcoin.Psbt.fromBase64(contract.releaseTransaction, { network: getNetwork() })

    // Don't trust the response, verify
    if (sellOffer.funding.txId !== reverseBuffer(psbt.txInputs[0].hash).toString('hex')) {
      errorMsg.push(i18n('error.invalidInput'))
    }
    if (psbt.txOutputs[0].address !== contract.releaseAddress) {
      errorMsg.push(i18n('error.releaseAddressMismatch'))
    }

    if (errorMsg.length) {
      updateMessage({
        msg: errorMsg.join('\n'),
        level: 'WARN',
      })
      return
    }
    // Sign psbt
    psbt.signInput(0, getEscrowWallet(sellOffer.id))

    const tx = psbt.finalizeInput(0, getFinalScript)
      .extractTransaction()
      .toHex()

    const [result, err] = await confirmPayment({ contractId: contract.id, releaseTransaction: tx })

    if (err) {
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
    : <ScrollView style={tw`pt-6`}>
      <View style={tw`pb-32`}>
        <Title
          title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
          subtitle={contract?.amount ? i18n('contract.subtitle', thousands(contract.amount)) : ''}
        />
        {contract && !contract.paymentConfirmed
          ? <View style={tw`mt-16`}>
            <Timer
              text={i18n(`contract.timer.${requiredAction}`)}
              start={getTimerStart(contract, requiredAction)}
              duration={TIMERS[requiredAction]}
            />
            <ContractDetails contract={contract} view={view} />
            <Button
              style={tw`mt-4`}
              title={i18n('chat')}
              secondary={true}
            />
            {view === 'buyer' && requiredAction === 'paymentMade'
              ? <Button
                onPress={postConfirmPaymentBuyer}
                style={tw`mt-2`}
                title={i18n('contract.payment.made')}
              />
              : null
            }
            {view === 'seller' && requiredAction === 'paymentConfirmed'
              ? <Button
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
            <Rate contract={contract} view={view} navigation={navigation} />
          </View>
          : null
        }
      </View>
    </ScrollView>
}