import React from 'react'
import { View } from 'react-native'
import { GoBackButtons } from './GoBackButtons'
import { InfoButtons } from './InfoButtons'
import { OptionButtons } from './OptionButtons'
import { PrimaryButtons } from './PrimaryButtons'

export const Buttons = () => (
  <View>
    <PrimaryButtons />
    <InfoButtons />
    <GoBackButtons />
    <OptionButtons />
  </View>
)
