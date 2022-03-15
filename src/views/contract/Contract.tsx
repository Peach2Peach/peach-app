import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Card, paymentDetailTemplates, SatsFormat, Text } from '../../components'
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
  const PaymentTo = contract?.paymentMethod ? paymentDetailTemplates[contract.paymentMethod] : null

  const saveAndUpdate = (contractData: Contract) => {
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
    if (!contract || view !== 'seller') return
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

  const postConfirmPayment = async () => {
    if (!contract) return
    await confirmPayment({ contractId: contract.id })
  }

  return <ScrollView>
    <View style={tw`pb-32`}>
      <Text style={tw`font-lato-bold text-center text-5xl leading-5xl`}>
        Contract
      </Text>
      {contract
        ? <View>
          <Text>{i18n('contract.paymentShouldBeMade')} 11:53:19</Text>
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
            <View style={tw`flex-row`}>
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