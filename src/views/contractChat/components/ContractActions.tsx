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
}

const IconButton = ({ icon, onPress, style }: IconButtonProps): ReactElement => {
  const [active, setActive] = useState(false)

  const onPressInHandler = () => setActive(true)
  const onPressOutHandler = () => setActive(false)
  return <Shadow shadow={mildShadowOrange}>
    <Pressable style={[
      tw`w-8 h-8 flex items-center justify-center border-2 border-peach-1 rounded`,
      active ? tw`bg-peach-1` : tw`bg-white-1`,
      style
    ]}
    onPress={onPress} onPressIn={onPressInHandler} onPressOut={onPressOutHandler}>
      <Icon id={icon} style={tw`w-4 h-4`}
        color={(active ? tw`text-white-1` : tw`text-peach-1`).color as string} />
    </Pressable>
  </Shadow>
}

type ContractActionsProps = ComponentProps & {
  contract: Contract,
  view: 'buyer' | 'seller' | ''
  navigation: StackNavigation,
}

export const ContractActions = ({ contract, view, navigation, style }: ContractActionsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const canCancel = view === 'buyer' || view === 'seller' && !contract.cancelationRequested
  const openCancelTrade = () => canCancel
    ? updateOverlay({
      content: <ConfirmCancelTrade contract={contract} navigation={navigation} />,
    })
    : null
  // const extendTime = () => alert('todo extend time')
  const raiseDispute = () => !contract.disputeActive
    ? navigation.navigate('dispute', { contractId: contract.id })
    : null

  return <View style={style}>
    {!contract.canceled ?
      <IconButton style={!canCancel ? tw`opacity-50` : {}}
        onPress={openCancelTrade}
        icon="cross"
      />
      : null
    }
    {/* <IconButton style={tw`mt-3`} onPress={extendTime} icon="timer" /> */}
    <IconButton style={[tw`mt-3`, contract.disputeActive ? tw`opacity-50` : {}]}
      onPress={raiseDispute}
      icon="dispute"
    />
  </View>
}

export default ContractActions
