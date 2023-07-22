import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { View } from 'react-native'
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
import { ClosePopupAction } from '../actions'

type Props = {
  offer: BuyOffer
}

export const BuyFilterAndSort = ({ offer }: Props) => {
  const defaultSorter = useOfferPreferences((state) => state.sortBy.buyOffer[0])
  const [sortBy, setSortBy] = useState<BuySorter>(defaultSorter)

  const [shouldApplyFilter, toggleShouldApplyFilter] = useToggleBoolean(offer.maxPremium !== null)
  const [maxPremium, setMaxPremium] = useState((offer.maxPremium ?? '').toString())
  const filter = { maxPremium: maxPremium === '' || !shouldApplyFilter ? null : parseFloat(maxPremium) }

  return (
    <PopupComponent
      content={
        <>
          <NewDivider title={i18n('filter')} />
          <View style={tw`flex-row items-center self-stretch justify-between`}>
            <Checkbox text={i18n('filter.maxPremium')} checked={shouldApplyFilter} onPress={toggleShouldApplyFilter} />
            <PercentageInput value={maxPremium} onChange={setMaxPremium} />
          </View>

          <NewDivider title={i18n('sorting.sortMatchesBy')} />
          <Sorters selectedValue={sortBy} onButtonPress={setSortBy} />
        </>
      }
      actions={
        <>
          <ClosePopupAction />
          <ApplyBuyFilterAction offerId={offer.id} filter={filter} sortBy={sortBy} />
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
  offerId: string
  filter: MatchFilter
  sortBy: BuySorter
}
function ApplyBuyFilterAction ({ offerId, filter, sortBy }: ApplyFilterActionProps) {
  const applyFilters = useApplyBuyFilterAndSorting(offerId, filter, sortBy)
  return <PopupAction onPress={applyFilters} label={i18n('apply')} iconId={'checkSquare'} reverseOrder />
}

function useApplyBuyFilterAndSorting (offerId: string, filter: MatchFilter, sortBy: BuySorter) {
  const queryClient = useQueryClient()

  const [setBuyOfferSorter, setBuyOfferFilter] = useOfferPreferences(
    (state) => [state.setBuyOfferSorter, state.setBuyOfferFilter],
    shallow,
  )
  const closePopup = usePopupStore((state) => state.closePopup)
  const { mutate: patchOffer } = usePatchOffer(offerId, filter)

  const applyFilters = useCallback(() => {
    setBuyOfferFilter(filter)
    setBuyOfferSorter(sortBy)
    patchOffer(undefined, {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['matches'] })
      },
    })
    closePopup()
  }, [closePopup, filter, patchOffer, queryClient, setBuyOfferFilter, setBuyOfferSorter, sortBy])

  return applyFilters
}
