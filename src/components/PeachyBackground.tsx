import { useEffect } from 'react'
import { StatusBar } from 'react-native'
import tw from '../styles/tailwind'
import { peachyGradient } from '../utils/layout'
import { isAndroid } from '../utils/system'
import { PeachyGradient } from './PeachyGradient'

export function PeachyBackground () {
  useEffect(() => {
    StatusBar.setBarStyle('light-content', true)
    if (isAndroid()) StatusBar.setBackgroundColor(peachyGradient[2].color, true)
  }, [])

  return <PeachyGradient style={tw`absolute`} />
}
