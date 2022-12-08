import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Animated, BackHandler, Dimensions, Easing, GestureResponderEvent, Pressable, View } from 'react-native'
import { HorizontalLine, Icon, PeachScrollView, Text } from '.'

import { DrawerContext } from '../contexts/drawer'
import tw from '../styles/tailwind'

const animConfig = {
  duration: 300,
  easing: Easing.ease,
  useNativeDriver: false,
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
const HEADERHEIGHT = 36
export const Drawer = ({ title, content, show, onClose }: DrawerState): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)
  const [{ height }] = useState(() => Dimensions.get('window'))
  const slideAnim = useRef(new Animated.Value(height)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState(false)

  useEffect(() => {
    const animate = (): any => {
      Animated.timing(slideAnim, {
        toValue: show ? HEADERHEIGHT : height,
        delay: show ? 50 : 0,
        ...animConfig,
      }).start()
      Animated.timing(fadeAnim, {
        toValue: show ? 0.4 : 0,
        delay: show ? 0 : 50,
        ...animConfig,
      }).start()
    }
    if (show) setDisplay(true)
    if (content) animate()
    if (!show) onClose()
  }, [content, fadeAnim, height, onClose, show, slideAnim])

  useEffect(() => {
    const listener = fadeAnim.addListener((fade) => {
      setDisplay(fade.value > 0)
      if (fade.value === 0) {
        updateDrawer({ show: false, content: false, onClose: () => {} })
      }
    })
    return () => {
      fadeAnim.removeListener(listener)
    }
  }, [fadeAnim, onClose, updateDrawer])

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (content) {
        updateDrawer({ show: false })
        return true
      }
      if (content) return true
      return false
    })
    return () => {
      listener.remove()
    }
  }, [content, updateDrawer])

  const closeDrawer = () => {
    updateDrawer({ show: false })
  }

  const registerTouchStart = (e: GestureResponderEvent) => (touchY = e.nativeEvent.pageY)
  const registerTouchMove = (e: GestureResponderEvent) => (touchY - e.nativeEvent.pageY < -20 ? closeDrawer() : null)

  return (
    <View style={[tw`absolute top-0 left-0 w-full h-full z-20 flex`, !display ? tw`hidden` : {}]}>
      <Animated.View style={[tw`w-full flex-grow bg-black-1`, { opacity: fadeAnim, height: slideAnim }]}>
        <Pressable onPress={closeDrawer} style={tw`absolute top-0 left-0 w-full h-full`} />
      </Animated.View>
      <Animated.View testID="drawer" style={tw`w-full flex-shrink-0 bg-primary-background-light rounded-t-3xl -mt-7`}>
        <View style={tw`py-6`} onTouchStart={registerTouchStart} onTouchMove={registerTouchMove}>
          <Text style={tw`drawer-title text-center`}>{title}</Text>
          <Pressable onPress={closeDrawer} style={tw`absolute right-7 top-6`}>
            <Icon id="xSquare" style={tw`w-6 h-6`} color={tw`text-black-4`.color} />
          </Pressable>
        </View>
        <HorizontalLine />
        <PeachScrollView style={tw`px-4 py-6`}>{content}</PeachScrollView>
      </Animated.View>
    </View>
  )
}

export default Drawer
