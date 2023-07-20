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
import { useQueryClient } from '@tanstack/react-query'

export const useSortAndFilterPopup = (offerId: string) => {
  const { offer } = useOfferDetails(offerId)
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const [filter, setFilter] = useState<{ maxPremium: number | null }>()
  const currentMaxPremium
    = ((offer && 'maxPremium' in offer ? offer : undefined) || { maxPremium: null })?.maxPremium ?? null
  const currentUserInput = filter?.maxPremium
  const realFilter = { maxPremium: currentUserInput !== undefined ? currentUserInput : currentMaxPremium }
  const { mutate: patchOffer } = usePatchOffer(offerId, realFilter)
  const queryClient = useQueryClient()

  const applyFilters = useCallback(() => {
    patchOffer(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['matches', offerId] })
      },
    })
    closePopup()
  }, [closePopup, offerId, patchOffer, queryClient])

  const showPopup = useCallback(() => {
    if (!offer) return
    setPopup({
      content: isBuyOffer(offer) ? (
        <BuySortAndFilter
          defaultPremium={currentMaxPremium !== null ? String(offer.maxPremium) : undefined}
          setFilter={setFilter}
        />
      ) : (
        <SellSortAndFilter />
      ),
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
  }, [applyFilters, closePopup, currentMaxPremium, offer, setPopup])

  return showPopup
}

type BuyFilterProps = {
  defaultPremium: string | undefined
  setFilter: (filter: { maxPremium: number | null }) => void
}

function BuySortAndFilter ({ defaultPremium, setFilter }: BuyFilterProps) {
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
  const [maxPremium, setMaxPremium] = useState(defaultPremium)
  const displayPremium = maxPremium ?? defaultPremium
  const [shouldApplyFilter, setShouldApplyFilter] = useState(maxPremium !== undefined)

  const onPremiumChange = (value: string) => {
    if (value === '') {
      setFilter({ maxPremium: null })
    } else if (shouldApplyFilter) {
      setFilter({ maxPremium: parseFloat(value) })
    }
    setMaxPremium(value)
  }

  const onCheckboxPress = () => {
    if (displayPremium !== undefined) {
      setShouldApplyFilter((prev) => {
        if (prev) {
          setFilter({ maxPremium: null })
        } else {
          setFilter({ maxPremium: displayPremium === '' ? null : parseFloat(displayPremium) })
        }
        return !prev
      })
    }
  }

  return (
    <Pressable style={tw`items-center self-stretch gap-4`} onPress={Keyboard.dismiss}>
      <Section title={i18n('filter')}>
        <View style={tw`flex-row items-center self-stretch justify-between`}>
          <Checkbox text={i18n('filter.maxPremium')} checked={shouldApplyFilter} onPress={onCheckboxPress} />
          <PercentageInput value={displayPremium} onChange={onPremiumChange} />
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
