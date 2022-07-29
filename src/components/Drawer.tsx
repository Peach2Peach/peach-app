
import React, { ReactElement, useContext, useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, Pressable, View } from 'react-native'
import { Button, Text, PeachScrollView, HorizontalLine } from '.'

import { DrawerContext } from '../contexts/drawer'
import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { getHeaderHeight } from './Header'

/**
 * @description Component to display the Drawer
 * @param props Component properties
 * @param props.title the drawer title
 * @param props.content the drawer content
 * @example
 * <Drawer title="Title" content={<Text>Drawer content</Text>} />
 */
export const Drawer = ({ title, content }: DrawerState): ReactElement => {
  const [, updateDrawer] = useContext(DrawerContext)
  const [{ height }] = useState(() => Dimensions.get('window'))
  const slideInAnim = useRef(new Animated.Value(-height)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState(true)

  useEffect(() => {
    Animated.timing(slideInAnim, {
      toValue: content ? -getHeaderHeight() : -height,
      duration: 300,
      useNativeDriver: false
    }).start()
    Animated.timing(fadeAnim, {
      toValue: content ? 0.4 : 0,
      duration: 300,
      useNativeDriver: false
    }).start()
  }, [content])

  useEffect(() => {
    fadeAnim.addListener((fade) => {
      setDisplay(fade.value > 0)
    })
  }, [])

  const closeDrawer = () => updateDrawer({ title: '', content: null })
  return <View style={[
    tw`absolute top-0 left-0 w-full h-full z-20`,
    !display ? tw`hidden` : {},
  ]}>
    <Animated.View style={[
      tw`absolute top-0 left-0 w-full h-full bg-black-1 z-10`,
      { opacity: fadeAnim },
    ]}>
      <Pressable onPress={closeDrawer} style={tw`absolute top-0 left-0 w-full h-full`} />
    </Animated.View>
    <Animated.View testID="drawer" style={[
      tw`absolute z-20 w-full bg-white-1 rounded-t-3xl px-8`,
      { maxHeight: height - getHeaderHeight(), bottom: slideInAnim }
    ]}>
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