import { useCallback, useEffect, useRef } from 'react'
import { Animated, BackHandler, Easing, Pressable, View, useWindowDimensions } from 'react-native'

import { shallow } from 'zustand/shallow'
import tw from '../../styles/tailwind'
import { DrawerHeader, DrawerOptions } from './components'
import { useDrawerState } from './useDrawerState'

const animConfig = {
  duration: 300,
  easing: Easing.ease,
  useNativeDriver: false,
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const Drawer = () => {
  const [{ content, show, onClose, options, previousDrawer }, updateDrawer] = useDrawerState(
    (state) => [state, state.updateDrawer],
    shallow,
  )
  const { height } = useWindowDimensions()
  const slideAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const showAnimations = [
      Animated.timing(slideAnim, {
        toValue: (height * 3) / 4,
        delay: 50,
        ...animConfig,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.4,
        delay: 0,
        ...animConfig,
      }),
    ]
    if (show && (content || options.length)) Animated.parallel(showAnimations).start()
  }, [content, fadeAnim, height, options.length, show, slideAnim])

  const closeDrawer = useCallback(() => {
    const closeAnimations = [
      Animated.timing(slideAnim, {
        toValue: 0,
        ...animConfig,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        ...animConfig,
      }),
    ]
    Animated.parallel(closeAnimations).start(() => {
      updateDrawer({ show: false })
      if (onClose) onClose()
    })
  }, [fadeAnim, onClose, slideAnim, updateDrawer])

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (previousDrawer) {
        updateDrawer(previousDrawer)
      } else {
        closeDrawer()
      }
      return true
    })
    return () => {
      listener.remove()
    }
  }, [closeDrawer, previousDrawer, updateDrawer])

  return (
    <View style={[tw`absolute top-0 left-0 z-20 flex w-full h-full`, !show && tw`hidden`]}>
      <AnimatedPressable onPress={closeDrawer} style={[tw`absolute w-full h-full bg-black-1`, { opacity: fadeAnim }]} />
      <Animated.View style={[tw`px-4 py-6 mt-auto bg-primary-background-light rounded-t-3xl`, { maxHeight: slideAnim }]}>
        <DrawerHeader closeDrawer={closeDrawer} />
        <DrawerOptions style={tw`pt-6`} />
      </Animated.View>
    </View>
  )
}
