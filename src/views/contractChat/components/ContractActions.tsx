
import React, { ReactElement, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Icon, Shadow, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { mildShadowOrange } from '../../../utils/layout'

type IconButtonProps = ComponentProps & {
  icon: string,
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
  view: 'buyer' | 'seller',
}

export const ContractActions = ({ contract, view, style }: ContractActionsProps): ReactElement => {
  const cancelTrade = () => alert('todo cancel trade')
  const extendTime = () => alert('todo extend time')
  const raiseDispute = () => alert('todo raise dispute')

  return <View style={style}>
    {view === 'buyer' ? <IconButton onPress={cancelTrade} icon="cross" /> : null}
    {/* <IconButton style={tw`mt-3`} onPress={extendTime} icon="timer" /> */}
    <IconButton style={tw`mt-3`} onPress={raiseDispute} icon="dispute" />
  </View>
}

export default ContractActions
