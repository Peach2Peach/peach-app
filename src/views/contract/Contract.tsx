import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  ScrollView,
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Text } from '../../components'
import { RouteProp, useIsFocused } from '@react-navigation/native'
import getContractEffect from './effects/getContractEffect'
import { info } from '../../utils/log'
import { MessageContext } from '../../utils/messageUtils'
import i18n from '../../utils/i18n'
import { saveContract } from '../../utils/contract'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'contract'>

type Props = {
  route: RouteProp<{ params: {
    contractId: string,
  } }>,
  navigation: ProfileScreenNavigationProp;
}

// TODO check offer status (escrow, searching, matched, online/offline, what else?)
export default ({ route, navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)
  const isFocused = useIsFocused()

  const [contractId, setContractId] = useState(route.params.contractId)
  const [contract, setContract] = useState<Contract>()

  const saveAndUpdate = (contractData: Contract) => {
    setContract(() => contractData)
    saveContract(contractData)
  }
  useEffect(() => {
    if (!isFocused) return

    setContractId(() => route.params.contractId)
  }, [isFocused])

  useEffect(getContractEffect({
    contractId,
    onSuccess: result => {
      info('Got contract', result)
      saveAndUpdate(result)
    },
    onError: () => updateMessage({ msg: i18n('error.general'), level: 'ERROR' })
  }), [contractId])

  return <ScrollView>
    <View style={tw`pb-32`}>
      <Text style={tw`font-lato-bold text-center text-5xl leading-5xl`}>
        Contract
      </Text>
      {contract
        ? <View>
          <Text style={tw`text-grey-2 mt-4`}>id: {contract.id}</Text>
          <Text style={tw`text-grey-2 mt-4`}>creationDate: {contract.creationDate}</Text>
          <Text style={tw`text-grey-2 mt-4`}>sellerId: {contract.sellerId}</Text>
          <Text style={tw`text-grey-2 mt-4`}>buyerId: {contract.buyerId}</Text>
          <Text style={tw`text-grey-2 mt-4`}>price: {contract.price}</Text>
          <Text style={tw`text-grey-2 mt-4`}>currency: {contract.currency}</Text>
          <Text style={tw`text-grey-2 mt-4`}>paymentMethod: {contract.paymentMethod}</Text>
          <Text style={tw`text-grey-2 mt-4`}>releaseAddress: {contract.releaseAddress}</Text>
          <Text style={tw`text-grey-2 mt-4`}>kycRequired: {contract.kycRequired}</Text>
          <Text style={tw`text-grey-2 mt-4`}>kycResponseDate: {contract.kycResponseDate}</Text>
          <Text style={tw`text-grey-2 mt-4`}>kycConfirmed: {contract.kycConfirmed}</Text>
          <Text style={tw`text-grey-2 mt-4`}>paymentConfirmed: {contract.paymentConfirmed}</Text>
          <Text style={tw`text-grey-2 mt-4`}>paymentMade: {contract.paymentMade}</Text>
          <Text style={tw`text-grey-2 mt-4`}>disputeActive: {contract.disputeActive}</Text>
        </View>
        : null
      }
    </View>
  </ScrollView>
}