import { useCallback, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { useOfferDetails } from '../../../hooks/query/useOfferDetails'
import { usePopupStore } from '../../../store/usePopupStore'
import { isBuyOffer } from '../../../utils/offer'
import { Pressable, View, Keyboard } from 'react-native'
import { Checkbox, HorizontalLine, RadioButtons, Text } from '../../../components'
import { PercentageInput } from '../../../components/inputs'
import { RadioButtonItem } from '../../../components/inputs/RadioButtons'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { usePatchOffer } from './usePatchOffer'

export const useSortAndFilterPopup = (offerId: string) => {
  const { offer } = useOfferDetails(offerId)
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const [filter, setFilter] = useState<{ maxPremium: number | null }>({ maxPremium: null })
  const { mutate: patchOffer } = usePatchOffer(offerId, filter)

  const applyFilters = useCallback(() => {
    patchOffer()
    closePopup()
  }, [closePopup, patchOffer])

  const showPopup = useCallback(() => {
    if (!offer) return
    setPopup({
      content: isBuyOffer(offer) ? <BuySortAndFilter setFilter={setFilter} /> : <SellSortAndFilter />,
      level: 'APP',
      action2: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: closePopup,
      },
      action1: {
        label: i18n('apply'),
        icon: 'checkSquare',
        callback: applyFilters,
      },
    })
  }, [applyFilters, closePopup, offer, setPopup])

  return showPopup
}

type BuyFilterProps = {
  setFilter: (filter: { maxPremium: number | null }) => void
}

function BuySortAndFilter ({ setFilter }: BuyFilterProps) {
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
  const [maxPremium, setMaxPremium] = useState<string>()
  const [shouldApplyFilter, setShouldApplyFilter] = useState(maxPremium !== undefined)

  const onPremiumChange = (value: string) => {
    if (value === '') {
      setFilter({ maxPremium: null })
      setMaxPremium(undefined)
    } else {
      setFilter({ maxPremium: parseFloat(value) })
      setMaxPremium(value)
    }
  }

  const onCheckboxPress = () => {
    if (maxPremium !== undefined) setShouldApplyFilter((prev) => {
      if (prev) {
        setFilter({ maxPremium: null })
      }
      return !prev
    })
  }

  return (
    <Pressable style={tw`items-center self-stretch gap-4`} onPress={Keyboard.dismiss}>
      <Section title={i18n('filter')}>
        <View style={tw`flex-row items-center self-stretch justify-between`}>
          <Checkbox text={i18n('filter.maxPremium')} checked={shouldApplyFilter} onPress={onCheckboxPress} />
          <PercentageInput value={maxPremium} onChange={onPremiumChange} />
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
