import { useRef } from 'react'
import { TouchableOpacity } from 'react-native'

import { CopyAble, Icon, Text } from '../../../../../components'
import { CopyRef } from '../../../../../components/ui/CopyAble'
import { usePublicProfileNavigation } from '../../../../../hooks'
import tw from '../../../../../styles/tailwind'

type Props = { id: string; isDispute?: boolean; showInfo?: boolean } & ComponentProps

export const UserId = ({ id, isDispute = false, showInfo = false, style }: Props) => {
  const goToUserProfile = usePublicProfileNavigation(id)
  const peachId = `Peach${id.slice(0, 8)}`
  let $copy = useRef<CopyRef>(null).current

  const buttonAction = showInfo ? goToUserProfile : $copy?.copy

  return (
    <>
      <TouchableOpacity
        testID="user-id"
        onPress={buttonAction}
        style={[
          tw`flex-row items-center px-[6px] border border-primary-mild-1 bg-primary-background-dark rounded-lg`,
          isDispute && tw`border-error-mild`,
          style,
        ]}
      >
        <Text style={tw`button-large mr-[2px]`}>{peachId}</Text>
        {showInfo ? (
          <Icon
            id="info"
            color={!isDispute ? tw`text-primary-main`.color : tw`text-error-main`.color}
            style={tw`w-[14px] h-[14px]`}
          />
        ) : (
          <CopyAble forwardRef={(r: CopyRef) => ($copy = r)} value={peachId} textPosition="top" />
        )}
      </TouchableOpacity>
    </>
  )
}
