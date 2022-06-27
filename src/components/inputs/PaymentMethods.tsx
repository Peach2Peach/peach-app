import React, { ReactElement, useContext, useState } from 'react'
import { Pressable, View } from 'react-native'
import { LOCALPAYMENTMETHODS, PAYMENTCATEGORIES } from '../../constants'
import { OverlayContext } from '../../contexts/overlay'
import CountrySelect from '../../overlays/CountrySelect'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import {
  getApplicablePaymentCategories,
  paymentMethodAllowedForCurrency,
  paymentMethodSelected
} from '../../utils/paymentMethod'
import Button from '../Button'
import Icon from '../Icon'
import { Headline } from '../text'
import { HorizontalLine } from '../ui'
import { Item } from './Item'


type PaymentMethodsProps = ComponentProps & {
  meansOfPayment: MeansOfPayment,
  currency: Currency,
  onChange: (currency: Currency, paymentMethod: PaymentMethod) => void,
  onCountrySelect: () => void,
  invertColors?: boolean,
}
// eslint-disable-next-line max-lines-per-function
export const PaymentMethods = ({
  meansOfPayment,
  currency,
  onChange,
  onCountrySelect,
  invertColors,
  style,
}: PaymentMethodsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [applicablePaymentCategories] = useState(() =>
    getApplicablePaymentCategories(currency)
  )
  const localPaymentMethods = LOCALPAYMENTMETHODS[currency]
  const textColor = invertColors ? tw`text-white-1` : tw`text-grey-1`
  const lineColor = invertColors ? tw`text-white-1` : tw`text-grey-1`

  const openCountrySelect = () => updateOverlay({
    content: <CountrySelect currency={currency} onConfirm={onCountrySelect} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  return <View style={style}>
    {applicablePaymentCategories
      .map((paymentCategory, i) => <View key={paymentCategory}>
        {i > 0 ? <HorizontalLine style={[tw`opacity-50 mt-8`, lineColor]}/> : null}

        <Headline style={[tw`text-lg`, i > 0 ? tw`mt-5` : {}, textColor]}>{paymentCategory}</Headline>
        <View style={tw`flex-row flex-wrap justify-center`}>
          {PAYMENTCATEGORIES[paymentCategory]
            .filter(paymentMethod => paymentMethodAllowedForCurrency(paymentMethod, currency))
            .map(paymentMethod => <View key={paymentMethod} style={tw`mt-3 mx-1`}>
              <Item
                label={i18n(`paymentMethod.${paymentMethod}`)}
                isSelected={paymentMethodSelected(paymentMethod, meansOfPayment[currency])}
                onPress={() => onChange(currency, paymentMethod)}
                invertColors={invertColors}
              />
            </View>
            )}
        </View>
      </View>
      )}

    {localPaymentMethods
      ? <View>
        <HorizontalLine style={[tw`opacity-50 mt-8`, lineColor]}/>
        {account.settings.country
          ? <View>
            <View style={tw`flex-row items-center justify-center mt-5`}>
              <Pressable onPress={openCountrySelect} style={tw`-ml-6`}>
                <Icon id="arrowLeft" style={tw`w-6 h-6 opacity-70`} color={textColor.color as string} />
              </Pressable>
              <Headline style={[tw`text-lg`, textColor]}>
                {i18n(`country.${account.settings.country}`)}
              </Headline>
            </View>
            <View style={tw`flex-row flex-wrap justify-center`}>
              {localPaymentMethods[account.settings.country]
                .filter(paymentMethod => paymentMethodAllowedForCurrency(paymentMethod, currency))
                .map(paymentMethod => <View key={paymentMethod} style={tw`mt-3 mr-2`}>
                  <Item
                    label={i18n(`paymentMethod.${paymentMethod}`)}
                    isSelected={paymentMethodSelected(paymentMethod, meansOfPayment[currency])}
                    onPress={() => onChange(currency, paymentMethod)}
                    invertColors={invertColors}
                  />
                </View>
                )}
            </View>
          </View>
          : <View style={tw`flex items-center`}>
            <Headline style={[tw`text-lg`, tw`mt-5`, textColor]}>{i18n('paymentCategory.localOptions')}</Headline>
            <Button
              style={tw`mt-2`}
              title={i18n('selectCountry')}
              secondary={true}
              onPress={openCountrySelect}
              wide={false}
            />
          </View>
        }
      </View>
      : null
    }
  </View>
}