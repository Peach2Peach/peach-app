import { useCallback, useState } from 'react'
import { usePopupStore } from '../../store/usePopupStore'
import { RadioButtons } from '../../components'
import { RadioButtonItem } from '../../components/inputs/RadioButtons'
import i18n from '../../utils/i18n'
import { useQueryClient } from '@tanstack/react-query'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { PopupAction } from '../../components/popup/PopupAction'
import { NewDivider } from '../../components/ui/NewDivider'
import { ClosePopupAction } from '../actions'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

export const SellSorters = () => {
  const defaultSorter = useOfferPreferences((state) => state.sortBy.sellOffer[0])
  const [sortBy, setSortBy] = useState<SellSorter>(defaultSorter)

  return (
    <PopupComponent
      content={
        <View style={tw`w-full gap-4 shrink`}>
          <NewDivider title={i18n('sorting.sortMatchesBy')} />
          <Sorters selectedValue={sortBy} onButtonPress={setSortBy} />
        </View>
      }
      actions={
        <>
          <ClosePopupAction />
          <ApplySellSorterAction sortBy={sortBy} />
        </>
      }
    />
  )
}

type SorterProps = {
  selectedValue: SellSorter
  onButtonPress: React.Dispatch<React.SetStateAction<SellSorter>>
}
function Sorters ({ selectedValue, onButtonPress }: SorterProps) {
  const items: RadioButtonItem<SellSorter>[] = [
    {
      display: i18n('sorting.bestReputation'),
      value: 'bestReputation',
    },
    {
      display: i18n('sorting.highestPrice'),
      value: 'highestPrice',
    },
  ]

  return <RadioButtons items={items} selectedValue={selectedValue} onButtonPress={onButtonPress} />
}

type ApplySorterActionProps = {
  sortBy: SellSorter
}
function ApplySellSorterAction ({ sortBy }: ApplySorterActionProps) {
  const applySorters = useApplySellSorting(sortBy)
  return <PopupAction onPress={applySorters} label={i18n('apply')} iconId={'checkSquare'} reverseOrder />
}

function useApplySellSorting (sortBy: SellSorter) {
  const queryClient = useQueryClient()
  const setSellOfferSorter = useOfferPreferences((state) => state.setSellOfferSorter)
  const closePopup = usePopupStore((state) => state.closePopup)

  const applySorters = useCallback(() => {
    setSellOfferSorter(sortBy)
    queryClient.invalidateQueries({ queryKey: ['matches'] })
    closePopup()
  }, [closePopup, queryClient, setSellOfferSorter, sortBy])

  return applySorters
}
