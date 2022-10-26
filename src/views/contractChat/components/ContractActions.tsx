import React, { ReactElement, useContext } from 'react'
import { GestureResponderEvent, Pressable, View, ViewStyle } from 'react-native'
import { Icon } from '../../../components'
import { IconType } from '../../../components/icons'
import { OverlayContext } from '../../../contexts/overlay'
import { ConfirmCancelTrade } from '../../../overlays/ConfirmCancelTrade'
import { ConfirmRaiseDispute } from '../../../overlays/ConfirmRaiseDispute'
import tw from '../../../styles/tailwind'
import { StackNavigation } from '../../../utils/navigation'

type IconButtonProps = ComponentProps & {
  icon: IconType
  onPress: (event: GestureResponderEvent) => void
  iconStyle?: ViewStyle | ViewStyle[]
}

const IconButton = ({ icon, onPress, style }: IconButtonProps): ReactElement => (
  <Pressable style={[tw`w-12 h-7 flex items-center justify-center rounded-lg bg-peach-1`, style]} onPress={onPress}>
    <Icon id={icon} style={[tw`w-5 h-5`]} color={tw`text-white-1`.color as string} />
  </Pressable>
)

type ContractActionsProps = ComponentProps & {
  contract: Contract
  view: 'buyer' | 'seller' | ''
  navigation: StackNavigation
}

export const ContractActions = ({ contract, view, navigation, style }: ContractActionsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const canCancel
    = !contract.disputeActive && !contract.paymentMade && !contract.canceled && !contract.cancelationRequested
  const canDispute = !contract.disputeActive && contract.paymentMethod !== 'cash'

  const openCancelTrade = () =>
    canCancel
      ? updateOverlay({
        content: <ConfirmCancelTrade contract={contract} navigation={navigation} />,
      })
      : null
  // const extendTime = () => alert('todo extend time')
  const raiseDispute = () =>
    canDispute
      ? updateOverlay({
        content: <ConfirmRaiseDispute contract={contract} navigation={navigation} />,
      })
      : null

  return (
    <View style={style}>
      <IconButton style={[tw`m-2`, !canDispute ? tw`opacity-50` : {}]} onPress={raiseDispute} icon="dispute" />
      {!contract.canceled ? (
        <IconButton style={[tw`m-2`, !canCancel ? tw`opacity-50` : {}]} onPress={openCancelTrade} icon="crossOutlined" />
      ) : null}
    </View>
  )
}

export default ContractActions
