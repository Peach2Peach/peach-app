import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Icon, Text, Timer } from '../../../components'
import { TIMERS } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { getTimerStart } from '../helpers/getTimerStart'

type ContractStatusInfoProps = {
  contract: Contract
  requiredAction: ContractAction
  view?: ContractViewer
}
export const ContractStatusInfo = ({ contract, requiredAction, view }: ContractStatusInfoProps): ReactElement => {
  if (contract.cancelationRequested) return (
    <View style={tw`flex-row items-center justify-center`}>
      <Text style={tw`button-medium text-center`}>{i18n('contract.cancelationPending')}</Text>
      <Icon id="xCircle" style={tw`w-5 h-5 ml-1 -mt-0.5`} color={tw`text-black-3`.color} />
    </View>
  )
  if (requiredAction === 'sendPayment') return (
    <Timer
      text={i18n(`contract.timer.${requiredAction}.${view}`)}
      start={getTimerStart(contract, requiredAction)}
      duration={TIMERS[requiredAction]}
    />
  )
  if (view === 'buyer' && requiredAction === 'confirmPayment') return (
    <View style={tw`flex-row items-center justify-center`}>
      <Text style={tw`button-medium text-center`}>{i18n('contract.timer.confirmPayment.buyer')}</Text>
    </View>
  )
  if (view === 'seller' && requiredAction === 'confirmPayment') return (
    <View style={tw`flex-row items-center justify-center`}>
      <Text style={tw`button-medium text-center`}>{i18n('contract.timer.confirmPayment.seller')}</Text>
      <Icon id="check" style={tw`w-5 h-5 ml-1 -mt-0.5`} color={tw`text-success-main`.color} />
    </View>
  )
  return <></>
}
