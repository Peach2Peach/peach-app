import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Button, Headline, Text } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import i18n from '../../utils/i18n'
import CurrencySelect from '../CurrencySelect'

type CurrencyInfoProps = {
  view: 'buyer' | 'seller',
  selectedCurrencies: Currency[],
  onCurrencySelect: (currencies: Currency[]) => void,
}

export default ({ view, selectedCurrencies, onCurrencySelect }: CurrencyInfoProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = () => updateOverlay({
    content: <CurrencySelect currencies={selectedCurrencies} onConfirm={onCurrencySelect} view={view} />,
    showCloseIcon: true,
    showCloseButton: false
  })

  return <View>
    <Headline style={tw`text-3xl leading-3xl text-white-1`}>
      {i18n('help.currency.title')}
    </Headline>
    <View style={tw`flex justify-center items-center`}>
      <Text style={tw`text-white-1 text-center`}>
        {i18n(`help.currency.description.${view}`)}
      </Text>
    </View>
    <View style={tw`flex justify-center items-center`}>
      <Button
        style={tw`mt-7`}
        title={i18n('close')}
        help={true}
        onPress={closeOverlay}
        wide={false}
      />
    </View>
  </View>
}