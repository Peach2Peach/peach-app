
import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, GestureResponderEvent, Pressable, View } from 'react-native'
import { HorizontalLine, PeachScrollView, Text } from '.'

import { DrawerContext } from '../contexts/drawer'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { getHeaderHeight } from './Header'

const animConfig = {
  duration: 300,
  easing: Easing.ease,
  useNativeDriver: false
}
let touchY = 0

/**
 * @description Component to display the Drawer
 * @param props Component properties
 * @param props.title the drawer title
 * @param props.content the drawer content
 * @example
 * <Drawer title="Title" content={<Text>Drawer content</Text>} />
 */
export const Drawer = ({ title, content, show, onClose }: DrawerState): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)
  const [{ height }] = useState(() => Dimensions.get('window'))
  const slideAnim = useRef(new Animated.Value(height)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState(false)

  const animate = (): any => {
    Animated.timing(slideAnim, {
      toValue: show ? getHeaderHeight() : height,
      delay: show ? 50 : 0,
      ...animConfig
    }).start()
    Animated.timing(fadeAnim, {
      toValue: show ? 0.4 : 0,
      delay: show ? 0 : 50,
      ...animConfig
    }).start()
  }

  useEffect(() => {
    if (show) setDisplay(true)
    if (content) animate()
  }, [show])

  useEffect(() => {
    fadeAnim.addListener((fade) => {
      setDisplay(fade.value > 0)
      if (fade.value === 0) updateDrawer({ show: false, content: false })
    })
  }, [])

  const closeDrawer = () => {
    onClose()
    updateDrawer({ show: false })
  }

  const registerTouchStart = (e: GestureResponderEvent) => touchY = e.nativeEvent.pageY
  const registerTouchMove = (e: GestureResponderEvent) => touchY - e.nativeEvent.pageY < -20 ? closeDrawer() : null

  return <View style={[
    tw`absolute top-0 left-0 w-full h-full z-20 flex`,
    !display ? tw`hidden` : {},
  ]}>
    <Animated.View style={[
      tw`w-full flex-grow bg-black-1`,
      { opacity: fadeAnim, height: slideAnim },
    ]}>
      <Pressable onPress={closeDrawer} style={tw`absolute top-0 left-0 w-full h-full`} />
    </Animated.View>
    <Animated.View testID="drawer" style={tw`w-full flex-shrink-0 bg-white-1 rounded-t-3xl -mt-7`}>
      <View style={tw`py-6`} onTouchStart={registerTouchStart} onTouchMove={registerTouchMove}>
        <Text style={tw`font-baloo text-base text-center uppercase`}>{title}</Text>
      </View>
      <HorizontalLine />
      <PeachScrollView style={tw`py-6`}>
        {content}
        <HorizontalLine style={tw`my-6`}/>
        <Text onPress={closeDrawer} style={tw`font-baloo text-base text-center uppercase`}>
          {i18n('close')}
        </Text>
      </PeachScrollView>
    </Animated.View>
  </View>
}

export default Drawer