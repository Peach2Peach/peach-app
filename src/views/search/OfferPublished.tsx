import { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, PrimaryButton, Text } from '../../components'
import i18n from '../../utils/i18n'
import { useOfferPublishedSetup } from './hooks/useOfferPublishedSetup'

export default (): ReactElement => {
  const { shouldGoBack, buttonAction } = useOfferPublishedSetup()

  return (
    <View style={tw`items-center justify-between h-full px-6 pb-7`}>
      <View style={tw`justify-center flex-shrink w-full h-full`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('offer.published.title')}</Text>
        <View style={tw`flex-row items-center mt-8`}>
          <Icon id="checkCircleInverted" style={tw`mr-6 w-23 h-23`} color={tw`text-primary-background-light`.color} />
          <Text style={tw`flex-shrink body-l text-primary-background-light`}>{i18n('offer.published.description')}</Text>
        </View>
      </View>
      <PrimaryButton white narrow onPress={buttonAction}>
        {i18n(shouldGoBack ? 'close' : 'goBackHome')}
      </PrimaryButton>
    </View>
  )
}
