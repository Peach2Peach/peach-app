import React from 'react'
import { TouchableOpacity } from 'react-native'

import { ConditionalWrapper, Icon, Text } from '../../../../../components'
import { usePublicProfileNavigation } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'

export const UserId = ({ id, showInfo = false }: { id: string; showInfo?: boolean }) => {
  const goToUserProfile = usePublicProfileNavigation(id)
  return (
    <ConditionalWrapper
      condition={showInfo}
      wrapper={(children) => (
        <TouchableOpacity onPress={goToUserProfile} style={tw`flex-row items-center`}>
          <Text style={[tw`underline text-primary-main`, { textDecorationColor: tw`text-black-2`.color }]}>
            {children}
          </Text>
          <Icon id="info" color={tw`text-black-2`.color} style={tw`w-[14px] h-[14px] ml-1`} />
        </TouchableOpacity>
      )}
    >
      <Text style={tw`tooltip`}>
        Peach<Text style={tw`uppercase tooltip`}>{id.slice(0, 8)}</Text>
      </Text>
    </ConditionalWrapper>
  )
}

export const NewUserId = ({ id, showInfo = false, style }: { id: string; showInfo?: boolean } & ComponentProps) => {
  const goToUserProfile = usePublicProfileNavigation(id)
  return (
    <TouchableOpacity
      onPress={goToUserProfile}
      style={[
        tw`flex-row items-center px-[6px] border border-primary-mild-1 bg-primary-background-dark rounded-lg`,
        style,
      ]}
      disabled={!showInfo}
    >
      <Text style={tw`button-large`}>Peach{id.slice(0, 8)}</Text>
      {showInfo && <Icon id="info" color={tw`text-primary-main`.color} style={tw`w-[14px] h-[14px] ml-[2px]`} />}
    </TouchableOpacity>
  )
}
