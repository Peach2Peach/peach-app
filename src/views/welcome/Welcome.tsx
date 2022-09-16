import React, { ReactElement, useRef, useState } from 'react'
import {
  Dimensions, Pressable,
  View
} from 'react-native'
import tw from '../../styles/tailwind'

import Carousel from 'react-native-snap-carousel'
import Logo from '../../assets/logo/peachLogo.svg'
import { Button } from '../../components'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import LetsGetStarted from './LetsGetStarted'
import PeachOfMind from './PeachOfMind'
import Swipe from './Swipe'
import WelcomeToPeach from './WelcomeToPeach'
import YouOwnYourData from './YouOwnYourData'
import { ContactButton } from '../report/components/ContactButton'

const onStartShouldSetResponder = () => true

type ScreenProps = {
  navigation: StackNavigation
}

const screens = [
  WelcomeToPeach,
  Swipe,
  PeachOfMind,
  YouOwnYourData,
  LetsGetStarted,
]

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: ScreenProps): ReactElement => {
  const [{ width }] = useState(() => Dimensions.get('window'))
  const [page, setPage] = useState(0)
  const $carousel = useRef<Carousel<any>>(null)

  const onBeforeSnapToItem = (i: number) => {
    setPage(i)
  }
  const next = () => {
    $carousel.current?.snapToNext()
  }
  const goTo = (p: number) => {
    $carousel.current?.snapToItem(p)
  }

  return <View style={tw`h-full flex`} testID="welcome">
    <ContactButton navigation={navigation}/>
    <View style={tw`h-full flex-shrink flex-col items-center justify-end`}>
      <View style={tw`h-full flex-shrink flex-col items-center justify-end mt-16 pb-10`}>
        <Logo style={[tw`flex-shrink max-w-full w-96 max-h-96 h-full`, { minHeight: 48 }]} />
      </View>
      <View style={tw`w-full flex-shrink`}>
        <Carousel
          ref={$carousel}
          data={screens}
          enableSnap={true} enableMomentum={false}
          sliderWidth={width} itemWidth={width}
          inactiveSlideScale={1} inactiveSlideOpacity={1} inactiveSlideShift={0}
          onBeforeSnapToItem={onBeforeSnapToItem}
          shouldOptimizeUpdates={true}
          renderItem={({ item: Item }) => <View onStartShouldSetResponder={onStartShouldSetResponder}
            style={tw`h-full px-6`}>
            <Item />
          </View>}
        />
      </View>
    </View>
    <View style={tw`mb-8 mt-4 flex items-center w-full`}>
      {page !== screens.length - 1
        ? <View>
          <Button testID="welcome-next"
            title={i18n('next')}
            wide={false}
            onPress={next}
          />
          <Button
            style={tw`opacity-0 mt-4`}
            title="layout dummy"
            secondary={true}
            wide={false}
          />
        </View>
        : <View>
          <Button testID="welcome-newUser"
            onPress={() => navigation.navigate('newUser', {})}
            wide={false}
            title={i18n('newUser')}
          />
          <Button testID="welcome-restoreBackup"
            style={tw`mt-4`}
            onPress={() => navigation.navigate('restoreBackup', {})}
            wide={false}
            secondary={true}
            title={i18n('restoreBackup')}
          />
        </View>
      }
      <View style={tw`w-full flex-row justify-center mt-11`}>
        {screens.map((screen, i) =>
          <Pressable key={i} onPress={() => goTo(i)}
            accessibilityLabel={i18n('accessibility.bulletPoint')}
            style={[
              tw`w-4 h-4 mx-2 rounded-full bg-peach-1`,
              i !== page ? tw`opacity-30` : {}
            ]}/>
        )}
      </View>
    </View>
  </View>
}