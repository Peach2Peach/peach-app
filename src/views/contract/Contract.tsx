import React, { ReactElement, useContext } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Icon, Loading, PeachScrollView, SatsFormat, Text, Timer, Title, TradeSummary } from '../../components'
import { ChatButton } from '../../components/chat/ChatButton'
import { TIMERS } from '../../constants'
import Payment from '../../overlays/info/Payment'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'
import ContractCTA from './components/ContractCTA'
import { getTimerStart } from './helpers/getTimerStart'
import { useContractSetup } from './hooks/useContractSetup'
import { OverlayContext } from '../../contexts/overlay'
import LoadingScreen from '../loading/LoadingScreen'

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const { contract, updatePending, view, requiredAction, loading, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()

  const openPaymentHelp = () =>
    updateOverlay({
      content: <Payment />,
      visible: true,
    })

  if (!contract || updatePending || contract.canceled || contract.paymentConfirmed) return <LoadingScreen />

  return (
    <PeachScrollView contentContainerStyle={tw`justify-center flex-grow px-8 pb-6`}>
      <View>
        <Text style={tw`text-center`}>{'info placeholder'}</Text>
        <View style={tw`mt-8`}>
          <ChatButton contract={contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
          <TradeSummary {...{ contract, view }} />
        </View>
      </View>
      <View style={tw`w-full flex items-center mt-12`}>
        {requiredAction === 'sendPayment' && (
          <Timer
            text={i18n(`contract.timer.${requiredAction}.${view}`)}
            start={getTimerStart(contract, requiredAction)}
            duration={TIMERS[requiredAction]}
          />
        )}
        <ContractCTA
          style={tw`mt-3`}
          {...{ view, requiredAction, loading, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
        />
      </View>
    </PeachScrollView>
  )
}
