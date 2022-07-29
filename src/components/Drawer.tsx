
import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Easing, LayoutChangeEvent, Pressable, View } from 'react-native'
import { Button, Text, PeachScrollView, HorizontalLine } from '.'

import { DrawerContext } from '../contexts/drawer'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { getHeaderHeight } from './Header'

const animConfig = {
  duration: 300,
  easing: Easing.ease,
  useNativeDriver: false
}

/**
 * @description Component to display the Drawer
 * @param props Component properties
 * @param props.title the drawer title
 * @param props.content the drawer content
 * @example
 * <Drawer title="Title" content={<Text>Drawer content</Text>} />
 */
export const Drawer = ({ title, content, show }: DrawerState): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)
  const [{ height }] = useState(() => Dimensions.get('window'))
  const slideAnim = useRef(new Animated.Value(height)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState(false)

  const animate = (): any => {
    Animated.timing(slideAnim, {
      toValue: show ? getHeaderHeight() : height,
      delay: show ? 100 : 0,
      ...animConfig
    }).start()
    Animated.timing(fadeAnim, {
      toValue: show ? 0.4 : 0,
      delay: show ? 0 : 100,
      ...animConfig
    }).start()
  }

  useEffect(() => {
    if (show) setDisplay(true)
    if (content) animate()
  }, [show])

  useEffect(() => {
    fadeAnim.addListener((fade) => setDisplay(fade.value > 0))
  }, [])

  const closeDrawer = () => updateDrawer({ title, content, show: false })

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
    <Animated.View testID="drawer" style={tw`w-full flex-shrink-0 bg-white-1 rounded-t-3xl px-8 -mt-7`}>
      <Text style={tw`mt-6 font-baloo text-base text-center uppercase`}>{title}</Text>
      <HorizontalLine style={tw`mt-6`} />
      <PeachScrollView style={tw`py-6`}>
        {content}
        <Button
          style={tw`mt-7`}
          title={i18n('close')}
          onPress={closeDrawer}
          wide={false}
        />
      </PeachScrollView>
    </Animated.View>
  </View>
}

export default Drawer