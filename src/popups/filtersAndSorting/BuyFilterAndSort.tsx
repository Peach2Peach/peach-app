import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Checkbox, PercentageInput, RadioButtons } from '../../components/inputs'
import { RadioButtonItem } from '../../components/inputs/RadioButtons'
import { PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { NewDivider } from '../../components/ui'
import { useToggleBoolean } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { isDefined } from '../../utils/validation'
import { ClosePopupAction } from '../actions'

type Props = {
  offer?: BuyOffer
}

export const BuyFilterAndSort = ({ offer }: Props) => {
  const [defaultSorter, defaultFilter] = useOfferPreferences(
    (state) => [state.sortBy.buyOffer[0], state.filter.buyOffer],
    shallow,
  )
  const [sortBy, setSortBy] = useState<BuySorter>(defaultSorter)

  const defaultPremium = offer ? (offer.maxPremium ?? '').toString() : defaultFilter.maxPremium?.toString() ?? ''
  const [shouldApplyFilter, toggleShouldApplyFilter] = useToggleBoolean(defaultPremium !== '')
  const [maxPremium, setMaxPremium] = useState(defaultPremium)
  const filter = { maxPremium: maxPremium === '' || !shouldApplyFilter ? null : parseFloat(maxPremium) }

  const percentageInput = useRef<TextInput>(null)
  const onCheckboxPress = () => {
    if (!shouldApplyFilter && maxPremium === defaultPremium) {
      percentageInput.current?.focus()
    }
    toggleShouldApplyFilter()
  }

  return (
    <PopupComponent
      content={
        <>
          <NewDivider title={i18n('filter')} />
          <View style={tw`flex-row items-center self-stretch justify-between`}>
            <Checkbox text={i18n('filter.maxPremium')} checked={shouldApplyFilter} onPress={onCheckboxPress} />
            <PercentageInput ref={percentageInput} value={maxPremium} onChange={setMaxPremium} />
          </View>

          <NewDivider title={i18n('sorting.sortMatchesBy')} />
          <Sorters selectedValue={sortBy} onButtonPress={setSortBy} />
        </>
      }
      actions={
        <>
          <ClosePopupAction />
          <ApplyBuyFilterAction offerId={offer?.id} filter={filter} sortBy={sortBy} />
        </>
      }
    />
  )
}

type SorterProps = {
  selectedValue: BuySorter
  onButtonPress: React.Dispatch<React.SetStateAction<BuySorter>>
}
function Sorters (radioButtonsProps: SorterProps) {
  const items: RadioButtonItem<BuySorter>[] = [
    {
      display: i18n('sorting.bestReputation'),
      value: 'bestReputation',
    },
    {
      display: i18n('sorting.highestAmount'),
      value: 'highestAmount',
    },
    {
      display: i18n('sorting.lowestPremium'),
      value: 'lowestPremium',
    },
  ]
  return <RadioButtons items={items} {...radioButtonsProps} />
}

type ApplyFilterActionProps = {
  offerId?: string
  filter: MatchFilter
  sortBy: BuySorter
}
function ApplyBuyFilterAction ({ offerId, filter, sortBy }: ApplyFilterActionProps) {
  return isDefined(offerId) ? (
    <OfferFilterAndSort offerId={offerId} filter={filter} sortBy={sortBy} />
  ) : (
    <GlobalFilterAndSort filter={filter} sortBy={sortBy} />
  )
}

function OfferFilterAndSort ({ offerId, filter, sortBy }: ApplyFilterActionProps & { offerId: string }) {
  const applyFilters = useOfferFilters(offerId, filter, sortBy)
  return <PopupAction onPress={applyFilters} label={i18n('apply')} iconId={'checkSquare'} reverseOrder />
}
function GlobalFilterAndSort ({ filter, sortBy }: ApplyFilterActionProps) {
  const applyFilters = useGlobalFilters(filter, sortBy)
  return <PopupAction onPress={applyFilters} label={i18n('apply')} iconId={'checkSquare'} reverseOrder />
}

function useOfferFilters (offerId: string, filter: MatchFilter, sortBy: BuySorter) {
  const queryClient = useQueryClient()
  const applyGlobalFilters = useGlobalFilters(filter, sortBy)
  const { mutate: patchOffer } = usePatchOffer(offerId, filter)

  const applyFilters = useCallback(() => {
    applyGlobalFilters()
    patchOffer(undefined, {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['matches'] })
      },
    })
  }, [applyGlobalFilters, patchOffer, queryClient])

  return applyFilters
}

function useGlobalFilters (filter: MatchFilter, sortBy: BuySorter) {
  const [setBuyOfferSorter, setBuyOfferFilter] = useOfferPreferences(
    (state) => [state.setBuyOfferSorter, state.setBuyOfferFilter],
    shallow,
  )
  const closePopup = usePopupStore((state) => state.closePopup)

  const applyGlobalFilters = useCallback(() => {
    setBuyOfferFilter(filter)
    setBuyOfferSorter(sortBy)
    closePopup()
  }, [closePopup, filter, setBuyOfferFilter, setBuyOfferSorter, sortBy])

  return applyGlobalFilters
}
