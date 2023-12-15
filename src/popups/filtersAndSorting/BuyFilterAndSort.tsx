import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { MatchFilter } from '../../../peach-api/src/@types/api/offerAPI'
import { PercentageInput } from '../../components/inputs'
import { Checkbox } from '../../components/inputs/Checkbox'
import { RadioButtonItem, RadioButtons } from '../../components/inputs/RadioButtons'
import { PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { NewDivider } from '../../components/ui'
import { useToggleBoolean } from '../../hooks'
import { usePatchOffer } from '../../hooks/offer/usePatchOffer'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePopupStore } from '../../store/usePopupStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { isDefined } from '../../utils/validation/isDefined'
import { matchesKeys } from '../../views/search/hooks/useOfferMatches'
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
        <View style={tw`w-full gap-4 shrink`}>
          <NewDivider title={i18n('offer.filter')} />
          <View style={tw`flex-row items-center self-stretch justify-between`}>
            <Checkbox text={i18n('offer.filter.maxPremium')} checked={shouldApplyFilter} onPress={onCheckboxPress} />
            <PercentageInput ref={percentageInput} value={maxPremium} onChange={setMaxPremium} />
          </View>

          <NewDivider title={i18n('offer.sorting.sortMatchesBy')} />
          <Sorters selectedValue={sortBy} onButtonPress={setSortBy} />
        </View>
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
      display: i18n('offer.sorting.bestReputation'),
      value: 'bestReputation',
    },
    {
      display: i18n('offer.sorting.highestAmount'),
      value: 'highestAmount',
    },
    {
      display: i18n('offer.sorting.lowestPremium'),
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
  const [showLoading, setShowLoading] = useState(false)
  const applyFilters = useOfferFilters(offerId, filter, sortBy)

  const onPress = useCallback(() => {
    setShowLoading(true)
    applyFilters()
  }, [applyFilters])

  return (
    <PopupAction onPress={onPress} label={i18n('apply')} iconId={'checkSquare'} loading={showLoading} reverseOrder />
  )
}

function GlobalFilterAndSort ({ filter, sortBy }: ApplyFilterActionProps) {
  const applyFilters = useGlobalFilters(filter, sortBy)
  const closePopup = usePopupStore((state) => state.closePopup)
  const onPress = useCallback(() => {
    applyFilters()
    closePopup()
  }, [applyFilters, closePopup])
  return <PopupAction onPress={onPress} label={i18n('apply')} iconId={'checkSquare'} reverseOrder />
}

function useOfferFilters (offerId: string, filter: MatchFilter, sortBy: BuySorter) {
  const queryClient = useQueryClient()
  const applyGlobalFilters = useGlobalFilters(filter, sortBy)
  const { mutate: patchOffer } = usePatchOffer()
  const closePopup = usePopupStore((state) => state.closePopup)

  const applyFilters = useCallback(() => {
    applyGlobalFilters()
    patchOffer(
      { offerId, newData: filter },
      {
        onSettled: async () => {
          await queryClient.invalidateQueries({ queryKey: matchesKeys.matches })
          await queryClient.refetchQueries({ queryKey: ['offerSummaries'] })
          await queryClient.refetchQueries({ queryKey: matchesKeys.matchesByOfferId(offerId) })
          closePopup()
        },
      },
    )
  }, [applyGlobalFilters, closePopup, filter, offerId, patchOffer, queryClient])

  return applyFilters
}

function useGlobalFilters (filter: MatchFilter, sortBy: BuySorter) {
  const [setBuyOfferSorter, setBuyOfferFilter] = useOfferPreferences(
    (state) => [state.setBuyOfferSorter, state.setBuyOfferFilter],
    shallow,
  )

  const applyGlobalFilters = useCallback(() => {
    setBuyOfferFilter(filter)
    setBuyOfferSorter(sortBy)
  }, [filter, setBuyOfferFilter, setBuyOfferSorter, sortBy])

  return applyGlobalFilters
}
