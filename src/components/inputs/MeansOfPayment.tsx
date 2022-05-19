import React, { ReactElement, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { CURRENCIES, LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import tw from '../../styles/tailwind'
import { intersect } from '../../utils/array'
import i18n from '../../utils/i18n'
import { paymentMethodAllowedForCurrency } from '../../utils/validation'
import Card from '../Card'
import Icon from '../Icon'
import { Text } from '../text'
import { HorizontalLine } from '../ui'

const onStartShouldSetResponder = () => true

const isLocalPaymentMethod = (paymentMethod: PaymentMethod) => LOCALPAYMENTMETHODS
  .map(tuple => tuple[0])
  .indexOf(paymentMethod) !== -1

const getLocalMoPCountry = (paymentMethod: PaymentMethod): string => {
  const localMoP = LOCALPAYMENTMETHODS.find(tuple => tuple[0] === paymentMethod)
  return localMoP ? localMoP[1] : ''
}


const hasApplicablePaymentMethods = (paymentCategory: PaymentCategory, currency: Currency): boolean =>
  PAYMENTCATEGORIES[paymentCategory].filter(paymentMethod =>
    paymentMethodAllowedForCurrency(paymentMethod, currency)
  ).length > 0

const getApplicablePaymentCategories = (currency: Currency): PaymentCategory[] =>
  (Object.keys(PAYMENTCATEGORIES) as PaymentCategory[])
    .filter(category => hasApplicablePaymentMethods(category, currency))

const hasLocalPaymentMethods = (paymentCategory: PaymentCategory, currency: Currency): boolean =>
  intersect(LOCALPAYMENTMETHODS.map(tuple => tuple[0]), PAYMENTCATEGORIES[paymentCategory])
    .filter(paymentMethod => paymentMethodAllowedForCurrency(paymentMethod, currency)).length > 0

const paymentMethodSelected = (paymentMethod: PaymentMethod, mappedPaymentMethods: MappedPaymentMethods) =>
  mappedPaymentMethods
  && mappedPaymentMethods[paymentMethod]
  && mappedPaymentMethods[paymentMethod].selected

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
      isComplete={meansOfPayment[c]
        && (Object.keys(meansOfPayment[c]) as PaymentMethod[]).some(p => meansOfPayment[c][p].selected)
      }
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

type MeansOfPaymentProps = {
  meansOfPayment: MeansOfPayment,
  setMeansOfPayment: React.Dispatch<React.SetStateAction<MeansOfPayment>>
}

// eslint-disable-next-line max-lines-per-function
export const MeansOfPayment = ({ meansOfPayment, setMeansOfPayment }: MeansOfPaymentProps): ReactElement => {
  const [update, setUpdate] = useState(0)
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0])
  const [applicablePaymentCategories, setApplicablePaymentCategories] = useState(
    getApplicablePaymentCategories(selectedCurrency)
  )

  const [selectedPaymentCategory, setSelectedPaymentCategory] = useState<PaymentCategory>('bankTransfer')
  const [showLocalOptions, setShowLocalOptions] = useState(false)
  const $carousel = useRef<Carousel<any>>(null)

  const changeCurrency = (currency: Currency) => {
    setSelectedCurrency(currency)
    setShowLocalOptions(false)
    setApplicablePaymentCategories(getApplicablePaymentCategories(currency))
    $carousel.current?.snapToItem(0)
  }

  const togglePaymentMethod = (currency: Currency, paymentMethod: PaymentMethod) => {
    setMeansOfPayment(mops => {
      mops[currency] = {
        ...(mops[currency] || {}),
        [paymentMethod]: {
          selected: !paymentMethodSelected(paymentMethod, mops[currency]),
          paymentData: null
        }
      }

      return mops
    })
    setUpdate(Math.random())
  }

  const prev = () => $carousel.current?.snapToPrev()
  const next = () => $carousel.current?.snapToNext()
  const onBeforeSnapToItem = (index: number) => {
    setSelectedPaymentCategory(applicablePaymentCategories[index])
    setShowLocalOptions(false)
  }
  const toggleShowLocalOptions = () => setShowLocalOptions(show => !show)

  return <View style={tw`px-7`}>
    <Currencies onChange={(c) => changeCurrency(c)} selected={selectedCurrency} meansOfPayment={meansOfPayment} />
    <View style={tw`flex-row justify-center items-center mt-8`}>
      <Pressable onPress={prev}>
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
      <Pressable onPress={next}>
        <Icon id="next" style={tw`w-3 h-3`} />
      </Pressable>
    </View>
    <HorizontalLine style={tw`mt-3`} />
    <View style={tw`flex-row flex-wrap justify-center`}>
      {PAYMENTCATEGORIES[selectedPaymentCategory]
        .filter((paymentMethod: PaymentMethod) => paymentMethodAllowedForCurrency(paymentMethod, selectedCurrency))
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
            isSelected={paymentMethodSelected(paymentMethod, meansOfPayment[selectedCurrency])}
            onPress={() => togglePaymentMethod(selectedCurrency, paymentMethod)}
          />
        </View>
        )}
    </View>
    {hasLocalPaymentMethods(selectedPaymentCategory, selectedCurrency)
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