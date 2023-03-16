import React from 'react'
import { TouchableOpacity } from 'react-native'

import { CopyAble, Icon, Text } from '../../../../../components'
import { usePublicProfileNavigation } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'

export const UserId = ({ id, showInfo = false, style }: { id: string; showInfo?: boolean } & ComponentProps) => {
  const goToUserProfile = usePublicProfileNavigation(id)
  const peachId = `Peach${id.slice(0, 8)}`
  return (
    <>
      <TouchableOpacity
        onPress={goToUserProfile}
        style={[
          tw`flex-row items-center px-[6px] border border-primary-mild-1 bg-primary-background-dark rounded-lg`,
          style,
        ]}
        disabled={!showInfo}
      >
        <Text style={tw`button-large mr-[2px]`}>{peachId}</Text>
        {showInfo ? (
          <Icon id="info" color={tw`text-primary-main`.color} style={tw`w-[14px] h-[14px]`} />
        ) : (
          <CopyAble value={peachId} />
        )}
      </TouchableOpacity>
    </>
  )
}
