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

export default (): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const { contract, updatePending, view, requiredAction, loading, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()

  const openPaymentHelp = () =>
    updateOverlay({
      content: <Payment />,
      visible: true,
    })

  return !contract || updatePending ? (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
    <PeachScrollView style={tw`pt-6`} contentContainerStyle={tw`px-6`}>
      <View style={tw`pb-32`}>
        <Title title={i18n(view === 'buyer' ? 'buy.title' : 'sell.title')} />
        <Text style={tw`-mt-1 text-center text-grey-2`}>
          {i18n('contract.subtitle')} <SatsFormat sats={contract.amount} color={tw`text-grey-2`} />
        </Text>
        <Text style={tw`mt-2 text-center text-grey-2`}>{i18n('contract.trade', contractIdToHex(contract.id))}</Text>
        {!contract.canceled && !contract.paymentConfirmed ? (
          <View style={tw`mt-16`}>
            <View>
              <ChatButton contract={contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
              <TradeSummary {...{ contract, view }} />
            </View>
            <View style={tw`flex-row justify-center mt-16`}>
              {/sendPayment/u.test(requiredAction) ? (
                <View style={tw`absolute flex-row items-center mb-1 bottom-full`}>
                  <Timer
                    text={i18n(`contract.timer.${requiredAction}.${view}`)}
                    start={getTimerStart(contract, requiredAction)}
                    duration={TIMERS[requiredAction]}
                    style={tw`flex-shrink`}
                  />
                  {view === 'buyer' && requiredAction === 'sendPayment' ? (
                    <Pressable onPress={openPaymentHelp} style={tw`p-2`}>
                      <Icon id="helpCircle" style={tw`w-4 h-4`} color={tw`text-blue-1`.color} />
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
              <ContractCTA {...{ view, requiredAction, loading, postConfirmPaymentBuyer, postConfirmPaymentSeller }} />
            </View>
          </View>
        ) : null}
      </View>
    </PeachScrollView>
  )
}
