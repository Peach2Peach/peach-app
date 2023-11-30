import { Fragment } from 'react'
import { View } from 'react-native'
import { Icon } from '../../components/Icon'
import { PeachText } from '../../components/text/Text'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { badges } from '../../views/settings/profile/profileOverview/components/badges'

export const MyBadges = () => (
  <>
    {badges.map(([icon, value], index) => (
      <Fragment key={`peachBadges.popup-${index}`}>
        <View style={tw`flex-row items-center mt-3`}>
          <View style={tw`w-[18px] h-[18px] p-[3px] mx-[3px] rounded-full bg-info-light`}>
            <Icon id={icon} color={tw.color('primary-background-light')} style={tw`w-3 h-3`} />
          </View>
          <PeachText style={tw`ml-1 subtitle-1`}>{i18n(`peachBadges.${value}`)}</PeachText>
        </View>
        <PeachText>{i18n(`peachBadges.${value}.description`)}</PeachText>
      </Fragment>
    ))}
  </>
)
