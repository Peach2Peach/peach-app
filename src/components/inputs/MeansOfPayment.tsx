import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { CURRENCIES, PAYMENTCATEGORIES, PAYMENTMETHODS } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import {
  getApplicablePaymentCategories,
  getLocalMoPCountry,
  hasLocalPaymentMethods,
  isLocalPaymentMethod,
  paymentMethodAllowedForCurrency,
  paymentMethodSelected
} from '../../utils/paymentMethod'
import Card from '../Card'
import Icon from '../Icon'
import { Text } from '../text'
import { HorizontalLine } from '../ui'

const onStartShouldSetResponder = () => true

type ItemProps = ComponentProps & {
  label: string,
  isSelected: boolean,
  isComplete?: boolean,
  onPress: () => void
}
const Item = ({ label, isSelected, isComplete, onPress, style }: ItemProps): ReactElement => <Pressable
  onPress={onPress}
  style={[
    tw`h-8 px-2 flex justify-center border border-grey-3 rounded`,
    isComplete
      ? tw`bg-peach-1 border-peach-1`
      : isSelected
        ? tw`border-peach-1`
        : {},
    style
  ]}>
  <Text style={[
    tw`font-baloo text-xs leading-6 text-center`,
    isComplete
      ? tw`text-white-1`
      : isSelected
        ? tw`text-peach-1`
        : tw`text-grey-3`,
  ]}>
    {label}
  </Text>
</Pressable>

type CurrenciesProps = ComponentProps & {
  selected: Currency,
  onChange: (currency: Currency) => void,
  meansOfPayment: MeansOfPayment,
}
const Currencies = ({
  selected,
  onChange,
  meansOfPayment
}: CurrenciesProps): ReactElement => <View style={tw`flex-row justify-center`}>
  {CURRENCIES.map((c, i) => <View key={c} style={i > 0 ? tw`ml-2` : {}}>
    <Item
      label={c} isSelected={c === selected}
      isComplete={(meansOfPayment as Required<MeansOfPayment>)[c]?.length > 0}
      onPress={() => onChange(c)}
      style={tw`w-16`}
    />
    {c === selected
      ? <View style={tw`absolute top-full mt-2 w-full flex items-center`}>
        <Icon id="triangleDown" color={tw`text-peach-1`.color as string}
          style={tw`w-3 h-3 opacity-50`}
        />
      </View>
      : null
    }
  </View>
  )}
</View>

type PaymentMethodsProps = {
  meansOfPayment: MeansOfPayment,
  paymentCategory: PaymentCategory,
  currency: Currency,
  onChange: (currency: Currency, paymentMethod: PaymentMethod) => void,
}
const PaymentMethods = ({ meansOfPayment, paymentCategory, currency, onChange }: PaymentMethodsProps): ReactElement => {
  const [showLocalOptions, setShowLocalOptions] = useState(false)
  const toggleShowLocalOptions = () => setShowLocalOptions(show => !show)

  useEffect(() => {
    setShowLocalOptions(false)
  }, [paymentCategory, currency])

  return <View>
    <View style={tw`flex-row flex-wrap justify-center`}>
      {PAYMENTCATEGORIES[paymentCategory]
        .filter((paymentMethod: PaymentMethod) => paymentMethodAllowedForCurrency(paymentMethod, currency))
        .filter((paymentMethod: PaymentMethod) => showLocalOptions
          ? isLocalPaymentMethod(paymentMethod)
          : !isLocalPaymentMethod(paymentMethod)
        )
        .map((paymentMethod: PaymentMethod) => <View key={paymentMethod} style={tw`mt-3 mr-2`}>
          {showLocalOptions
            ? <Text style={tw`text-sm text-grey-2 text-center`}>
              {i18n(`country.${getLocalMoPCountry(paymentMethod)}`)}
            </Text>
            : null
          }
          <Item
            label={i18n(`paymentMethod.${paymentMethod}`)}
            isSelected={paymentMethodSelected(paymentMethod, meansOfPayment[currency])}
            onPress={() => onChange(currency, paymentMethod)}
          />
        </View>
        )}
    </View>
    {hasLocalPaymentMethods(paymentCategory, currency)
      ? <Pressable onPress={toggleShowLocalOptions} style={tw`flex-row justify-center mt-4`}>
        <Card style={tw`flex-row items-center py-1 px-3`}>
          {showLocalOptions
            ? <Icon id="triangleLeft" style={tw`w-2 h-2 mr-3 -mt-0.5`} color={tw`text-peach-1`.color as string} />
            : null
          }
          <Text style={tw`font-baloo text-sm`}>
            {i18n(showLocalOptions ? 'paymentCategory.globalOptions' : 'paymentCategory.localOptions')}
          </Text>
          {!showLocalOptions
            ? <Icon id="triangleRight" style={tw`w-2 h-2 ml-3 -mt-0.5`} color={tw`text-peach-1`.color as string} />
            : null
          }
        </Card>
      </Pressable>
      : null
    }
  </View>
}

type MeansOfPaymentProps = {
  meansOfPayment: MeansOfPayment,
  setMeansOfPayment: React.Dispatch<React.SetStateAction<MeansOfPayment>>
}

// eslint-disable-next-line max-lines-per-function
export const MeansOfPayment = ({ meansOfPayment, setMeansOfPayment }: MeansOfPaymentProps): ReactElement => {
  const [update, setUpdate] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0])
  const [applicablePaymentCategories, setApplicablePaymentCategories] = useState(() =>
    getApplicablePaymentCategories(selectedCurrency)
  )
  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<PaymentCategory>(
    applicablePaymentCategories[0]
  )

  const $carousel = useRef<Carousel<any>>(null)

  const togglePaymentMethod = (currency: Currency, paymentMethod: PaymentMethod) => {
    setMeansOfPayment(mops => {
      if (!mops[currency]) mops[currency] = []

      if (mops[currency]?.indexOf(paymentMethod) !== -1) {
        mops[currency] = mops[currency]?.filter(p => p !== paymentMethod)
      } else {
        mops[currency]?.push(paymentMethod)
      }

      return { ...mops }
    })
    setUpdate(Math.random())
  }

  const prev = () => $carousel.current?.snapToPrev()
  const next = () => $carousel.current?.snapToNext()
  const onBeforeSnapToItem = (index: number) => {
    setSelectedPaymentCategory(applicablePaymentCategories[index])
  }

  useEffect(() => {
    setApplicablePaymentCategories(getApplicablePaymentCategories(selectedCurrency))
    setTimeout(() => $carousel.current?.snapToItem(0))
  }, [selectedCurrency])

  useEffect(() => {
    setSelectedPaymentCategory(applicablePaymentCategories[0])
    setTimeout(() => $carousel.current?.snapToItem(0))
  }, [applicablePaymentCategories])

  useEffect(() => { // clean MoPs from removed payment methods
    Object.keys(meansOfPayment).forEach(c => {
      const paymentMethods = meansOfPayment[c as Currency]
      if (!paymentMethods) return
      paymentMethods
        .filter(p => PAYMENTMETHODS.indexOf(p) === -1)
        .forEach(p => {
          togglePaymentMethod(c as Currency, p)
        })
    })
  }, [applicablePaymentCategories])

  return <View style={tw`px-7`}>
    <Currencies onChange={(c) => setSelectedCurrency(c)} selected={selectedCurrency} meansOfPayment={meansOfPayment} />
    <View style={tw`flex-row justify-center items-center mt-8`}>
      <Pressable onPress={prev} style={applicablePaymentCategories.length === 1 ? tw`opacity-50` : {}}>
        <Icon id="prev" style={tw`w-3 h-3`} />
      </Pressable>
      <View>
        <Carousel loop={true}
          ref={$carousel}
          data={applicablePaymentCategories}
          enableSnap={true} enableMomentum={false}
          sliderWidth={180} itemWidth={140}
          inactiveSlideOpacity={0}
          activeSlideAlignment="center"
          lockScrollWhileSnapping={true}
          shouldOptimizeUpdates={true}
          onBeforeSnapToItem={onBeforeSnapToItem}
          renderItem={({ item }) => <View onStartShouldSetResponder={onStartShouldSetResponder}
            style={tw`py-4 bg-transparent`}>
            <Card>
              <Text style={tw`font-baloo text-xs leading-6 text-center`}>
                {i18n(`paymentCategory.${item}`)}
              </Text>
            </Card>
          </View>}
        />
      </View>
      <Pressable onPress={next} style={applicablePaymentCategories.length === 1 ? tw`opacity-50` : {}}>
        <Icon id="next" style={tw`w-3 h-3`} />
      </Pressable>
    </View>
    <HorizontalLine style={tw`mt-3`} />
    <PaymentMethods
      meansOfPayment={meansOfPayment}
      paymentCategory={selectedPaymentCategory}
      currency={selectedCurrency}
      onChange={(currency, paymentMethod) => togglePaymentMethod(currency, paymentMethod)}
    />

    {/* <View style={tw`flex-row flex-wrap`}>
      {PAYMENTCATEGORIES[selectedPaymentCategory]
        .filter((p: PaymentMethod) => paymentMethodSelected(p, meansOfPayment[selectedCurrency]))
        .map((paymentMethod: PaymentMethod) =>
          <Item
            key={paymentMethod}
            label={i18n(`paymentMethod.${paymentMethod}`)}
            isSelected={paymentMethodSelected(paymentMethod, meansOfPayment[selectedCurrency])}
            onPress={() => togglePaymentMethod(selectedCurrency, paymentMethod)}
            style={tw`mt-3 mr-2`}
          />
        )}
    </View> */}
  </View>
}

export default MeansOfPayment