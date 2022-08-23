import React, { ReactElement, useContext, useState } from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'
import { Icon, Shadow } from '../../../components'
import { IconType } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import ConfirmCancelTrade from '../../../overlays/ConfirmCancelTrade'
import tw from '../../../styles/tailwind'
import { mildShadowOrange } from '../../../utils/layout'
import { StackNavigation } from '../../../utils/navigation'

type IconButtonProps = ComponentProps & {
  icon: IconType,
  onPress: (event: GestureResponderEvent) => void,
  hasShadow? : boolean
}

const IconButton = ({ icon, onPress, style }: IconButtonProps): ReactElement => {

  return <Pressable style={[
    tw`w-12 h-7 flex items-center justify-center rounded-lg bg-peach-1`,
    style
  ]}
  onPress={onPress} >
    <Icon id={icon} style={tw`w-3 h-3`}
      color={(tw`text-white-1`).color as string} />
  </Pressable>
}




type ContractActionsProps = ComponentProps & {
  contract: Contract,
  view: 'buyer' | 'seller' | ''
  navigation: StackNavigation,
}

export const ContractActions = ({ contract, view, navigation, style }: ContractActionsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const canCancel = !contract.disputeActive && !contract.paymentMade
    && !contract.canceled && !contract.cancelationRequested
  const canDispute = !contract.disputeActive && contract.paymentMethod !== 'cash'

  const openCancelTrade = () => canCancel
    ? updateOverlay({
      content: <ConfirmCancelTrade contract={contract} navigation={navigation} />,
    })
    : null
  // const extendTime = () => alert('todo extend time')
  const raiseDispute = () => canDispute
    ? navigation.navigate('dispute', { contractId: contract.id })
    : null

  return <View style={style}>
    <IconButton style={[tw`m-2`, !canDispute ? tw`opacity-50` : {}]}
      onPress={raiseDispute}
      icon="dispute"
    />
    {!contract.canceled
      ? <IconButton style={[tw`m-2`,!canCancel ? tw`opacity-50` : {}]}
        onPress={openCancelTrade}
        icon="crossOutlined"
      />
      : null
    }
  </View>
}

export default ContractActions
