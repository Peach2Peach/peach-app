import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Card, paymentDetailTemplates, SatsFormat, Text, Title } from '../../components'
import { RouteProp } from '@react-navigation/native'
import getContractEffect from './effects/getContractEffect'
import { error, info } from '../../utils/log'
import { MessageContext } from '../../utils/message'
import i18n from '../../utils/i18n'
import { getContract, saveContract } from '../../utils/contract'
import { getBitcoinContext } from '../../utils/bitcoin'
import { account } from '../../utils/account'
import { confirmPayment, postPaymentData } from '../../utils/peachAPI'
import { getOffer } from '../../utils/offer'
import { decrypt, signAndEncrypt, verify } from '../../utils/pgp'
import { msToTimer, thousands } from '../../utils/string'
import { TIMERS } from '../../constants'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp;
}

// TODO check offer status (escrow, searching, matched, online/offline, what else?)
// eslint-disable-next-line max-lines-per-function
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const { currency } = getBitcoinContext()

  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract|null>(getContract(contractId))
  const [view, setView] = useState('')
  const [timer, setTimer] = useState(0)
  const [timerType, setTimerType] = useState('')

  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null

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
      let decryptedPaymentData: PaymentData

      // info('Got contract', result)

      setView(() => account.publicKey === result.seller.id ? 'seller' : 'buyer')

      if (typeof contract?.paymentData === 'object') {
        saveAndUpdate({
          ...result,
          paymentData: contract.paymentData
        })
        return
      }

      if (view === 'buyer' && result.paymentData && result.paymentDataSignature) {
        try {
          const decryptedPaymentDataString = await decrypt(result.paymentData)
          decryptedPaymentData = JSON.parse(decryptedPaymentDataString)

          if (!await verify(result.paymentDataSignature, decryptedPaymentDataString, result.seller.pgpPublicKey)) {
            // TODO at this point we should probably cancel the order?
            throw new Error('Signature of payment data could not be verified')
          }
        } catch (err) {
          error(err)
          updateMessage({
            msg: i18n('error.invalidPaymentData'),
            level: 'ERROR',
          })
          return
        }
        saveAndUpdate({
          ...result,
          paymentData: decryptedPaymentData
        })
        return
      }

      saveAndUpdate(result)
    },
    onError: err => updateMessage({
      msg: i18n(err.error || 'error.general'),
      level: 'ERROR',
    })
  }), [contractId])

  useEffect(() => {
    if (!contract) return

    if (contract.kycRequired && !contract.kycConfirmed) {
      setTimerType('kycResponse')
    } else if (!contract.paymentMade) {
      setTimerType('paymentMade')
    } else if (contract.paymentMade && !contract.paymentConfirmed) {
      setTimerType('paymentConfirmed')
    }

    if (view !== 'seller') return
    if (contract.paymentDataSignature) return

    (async () => {
      const sellOffer = getOffer(contract.id.split('-')[0]) as SellOffer
      const paymentData = sellOffer.paymentData.find(data => data.type === contract.paymentMethod)
      const encryptedResult = await signAndEncrypt(
        JSON.stringify(paymentData),
        contract.buyer.pgpPublicKey
      )
      const [result, err] = await postPaymentData({
        contractId: contract.id,
        paymentData: encryptedResult.encrypted,
        signature: encryptedResult.signature
      })

      if (err) {
        updateMessage({ msg: i18n(err.error || 'error.general'), level: 'ERROR' })
        return
      }

      saveAndUpdate({ ...contract, paymentData, paymentDataSignature: encryptedResult.signature })
    })()
  }, [contract])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!contract) return
      const now = (new Date()).getTime()
      let timeLeft = 0

      if (timerType === 'kycResponse') {
        timeLeft = TIMERS.kycResponse - (now - contract.creationDate.getTime())
      } else if (timerType === 'paymentMade') {
        const start = contract.kycRequired && contract.kycResponseDate
          ? contract.kycResponseDate
          : contract.creationDate
        timeLeft = TIMERS.paymentMade - (now - start.getTime())
      } else if (timerType === 'paymentConfirmed' && contract.paymentMade) {
        timeLeft = TIMERS.paymentConfirmed - (now - contract.paymentMade.getTime())
      }

      setTimer(timeLeft > 0 ? timeLeft : 0)
    })

    return () => {
      clearInterval(interval)
    }
  }, [timerType])

  const postConfirmPayment = async () => {
    if (!contract) return
    await confirmPayment({ contractId: contract.id })

    if (view === 'buyer') {
      saveAndUpdate({
        ...contract,
        paymentMade: new Date()
      })
    } else {
      saveAndUpdate({
        ...contract,
        paymentConfirmed: new Date()
      })
    }
  }

  return <ScrollView style={tw`pt-6`}>
    <View style={tw`pb-32`}>
      <Title
        title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')}
        subtitle={contract?.amount ? i18n('contract.subtitle', thousands(contract.amount)) : ''}
      />
      {contract
        ? <View style={tw`mt-16`}>
          <View style={tw`flex-row justify-center`}>
            <Text style={tw`font-baloo text-sm`}>{i18n(`contract.timer.${timerType}`)}</Text>
            <Text style={tw`w-16 pl-1 font-baloo text-sm text-peach-1`}>{msToTimer(timer)}</Text>
          </View>
          <Card style={tw`p-4`}>
            <View style={tw`flex-row`}>
              <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>
                {i18n(view === 'seller' ? 'buyer' : 'seller')}:
              </Text>
              {view === 'seller'
                ? <Text style={tw`w-5/8`}>
                  {contract.buyer.id.substring(0, 8)}
                </Text>
                : <Text style={tw`w-5/8`}>
                  {contract.seller.id.substring(0, 8)}
                </Text>
              }
            </View>
            <View style={tw`flex-row mt-3`}>
              <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('amount')}:</Text>
              <Text style={tw`w-5/8`}>
                <SatsFormat sats={contract.amount} color={tw`text-black-1`} />
              </Text>
            </View>
            <View style={tw`flex-row mt-3`}>
              <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('price')}:</Text>
              <View style={tw`w-5/8`}>
                <View>
                  <Text>
                    {i18n(
                      `currency.format.${currency}`,
                      contract.price.toFixed(2)
                    )}
                  </Text>
                </View>
              </View>
            </View>
            <View style={tw`flex-row mt-3`}>
              <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('currency')}:</Text>
              <View style={tw`w-5/8`}>
                <Text>{contract.currency}</Text>
              </View>
            </View>
            <View style={tw`flex-row mt-3`}>
              <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('payment')}:</Text>
              <View style={tw`w-5/8`}>
                <Text>{i18n(`paymentMethod.${contract.paymentMethod}`)}</Text>
              </View>
            </View>
            {contract.paymentData && PaymentTo
              ? <View style={tw`flex-row mt-3`}>
                <Text style={tw`font-baloo text-lg text-peach-1 w-3/8`}>{i18n('contract.payment.to')}:</Text>
                <View style={tw`w-5/8`}>
                  <PaymentTo paymentData={contract.paymentData}/>
                </View>
              </View>
              : null
            }
          </Card>
          <Button
            style={tw`mt-4`}
            title={i18n('chat')}
            secondary={true}
          />
          {view === 'buyer' && !contract.paymentMade && contract.paymentData
            ? <Button
              onPress={postConfirmPayment}
              style={tw`mt-2`}
              title={i18n('contract.payment.made')}
            />
            : null
          }
          {view === 'seller' && contract.paymentMade
            ? <Button
              style={tw`mt-2`}
              title={i18n('contract.payment.received')}
            />
            : null
          }
        </View>
        : null
      }
    </View>
  </ScrollView>
}