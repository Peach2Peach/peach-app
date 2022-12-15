import React from 'react'
import tw from '../../styles/tailwind'
import Icon from '../Icon'

export const StatsIcon = () => (
  <>
    <Icon id={'alignJustify'} style={tw`absolute`} color={tw`text-primary-mild`.color} />
    <Icon id={'alignLeft'} color={tw`text-primary-main`.color} />
  </>
)
