import { useCallback, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { usePopupStore } from '../../../store/usePopupStore'
import { isBuyOffer } from '../../../utils/offer'
import { Pressable, View, Keyboard } from 'react-native'
import { Checkbox, HorizontalLine, RadioButtons, Text } from '../../../components'
import { PercentageInput } from '../../../components/inputs'
import { RadioButtonItem } from '../../../components/inputs/RadioButtons'
import { useToggleBoolean } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const useSortAndFilterPopup = (offerId: string) => {
  const { offer } = useOfferDetails(offerId)
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)

  const showPopup = useCallback(() => {
    if (!offer) return
    setPopup({
      content: isBuyOffer(offer) ? <BuySortAndFilter /> : <SellSortAndFilter />,
      level: 'APP',
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closePopup,
      },
      action1: {
        label: i18n('apply'),
        icon: 'checkSquare',
        callback: () => {},
      },
    })
  }, [closePopup, offer, setPopup])

  return showPopup
}

function BuySortAndFilter () {
  const items: RadioButtonItem<BuySorter>[] = [
    {
      display: i18n('sorting.highestAmount'),
      value: 'highestAmount',
    },
    {
      display: i18n('sorting.lowestPremium'),
      value: 'lowestPremium',
    },
    {
      display: i18n('sorting.bestReputation'),
      value: 'bestReputation',
    },
  ]
  const [selectedValue, setSelectedValue] = useState<BuySorter>('highestAmount')
  const [applyMaxPremium, toggleCheckbox] = useToggleBoolean()
  const [maxPremium, setMaxPremium] = useState<string>()

  const onCheckboxPress = () => {
    if (maxPremium !== undefined) toggleCheckbox()
  }

  return (
    <Pressable style={tw`items-center self-stretch gap-4`} onPress={Keyboard.dismiss}>
      <Section title={i18n('filter')}>
        <View style={tw`flex-row items-center self-stretch justify-between`}>
          <Checkbox text={i18n('filter.maxPremium')} checked={applyMaxPremium} onPress={onCheckboxPress} />
          <PercentageInput value={maxPremium} onChange={setMaxPremium} />
        </View>
      </Section>
      <Section title={i18n('sorting.sortMatchesBy')}>
        <RadioButtons items={items} selectedValue={selectedValue} onButtonPress={setSelectedValue} />
      </Section>
    </Pressable>
  )
}

function SellSortAndFilter () {
  const items: RadioButtonItem<SellSorter>[] = [
    {
      display: i18n('sorting.highestPrice'),
      value: 'highestPrice',
    },
    {
      display: i18n('sorting.bestReputation'),
      value: 'bestReputation',
    },
  ]
  const [selectedValue, setSelectedValue] = useState<SellSorter>('highestPrice')

  return (
    <Pressable style={tw`items-center self-stretch gap-4`} onPress={Keyboard.dismiss}>
      <Section title={i18n('sorting.sortMatchesBy')}>
        <RadioButtons items={items} selectedValue={selectedValue} onButtonPress={setSelectedValue} />
      </Section>
    </Pressable>
  )
}

type SectionProps = {
  title: string
  children: React.ReactNode
}
function Section ({ title, children }: SectionProps) {
  return (
    <>
      <View style={tw`flex-row items-center self-stretch justify-center gap-2`}>
        <Text style={tw`h7`}>{title}</Text>
        <HorizontalLine />
      </View>
      {children}
    </>
  )
}
