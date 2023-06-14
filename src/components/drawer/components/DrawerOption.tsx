import { TouchableOpacity, View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Flag } from '../../Flag'
import Icon from '../../Icon'
import PaymentLogo from '../../payment/PaymentLogo'
import { Text, FixedHeightText } from '../../text'

export const DrawerOption = ({
  logoID,
  flagID,
  title,
  subtext,
  iconRightID,
  highlighted,
  onPress,
}: DrawerOptionType) => (
  <TouchableOpacity
    style={[
      tw`flex-row items-center gap-3 px-8`,
      flagID
        ? subtext
          ? tw`py-2px`
          : tw`py-8px`
        : logoID
          ? tw`py-4px`
          : !subtext && (iconRightID ? tw`py-4px` : tw`py-6px`),
    ]}
    onPress={onPress}
  >
    {logoID && (
      <View
        style={tw`items-center justify-center w-8 h-8 border border-black-6 bg-primary-background-light rounded-5px`}
      >
        <PaymentLogo id={logoID} style={tw`w-6 h-6`} />
      </View>
    )}
    {flagID && <Flag id={flagID} style={tw`w-8 h-6`} />}

    <View style={[tw`justify-center flex-grow`, flagID && tw`gap-2px`]}>
      {flagID || logoID || !subtext ? (
        <FixedHeightText height={flagID && subtext ? 17 : 22} style={tw`input-title`}>
          {title}
        </FixedHeightText>
      ) : (
        <Text style={[tw`input-title`, highlighted && tw`text-primary-main`]}>{title}</Text>
      )}

      {subtext
        && (flagID ? (
          <FixedHeightText height={17} style={tw`body-s`}>
            {subtext}
          </FixedHeightText>
        ) : (
          <Text style={[tw`body-s`, highlighted && tw`text-primary-main`]}>{subtext}</Text>
        ))}
    </View>
    {(iconRightID || highlighted) && (
      <Icon id={iconRightID ? iconRightID : 'star'} style={tw`w-6 h-6`} color={tw`text-primary-main`.color} />
    )}
  </TouchableOpacity>
)
