import { useEffect, useState } from 'react'
import { useBitcoinPrices } from '../../../../hooks'
import { convertFiatToSats, getPrice } from '../../../../utils/market'

type Props = {
  amount: number
  onChange: (amount: number) => void
}

export const useCustomAmountSetup = ({ amount, onChange }: Props) => {
  const { displayCurrency, bitcoinPrice } = useBitcoinPrices(amount)
  const [customFiatPrice, setCustomFiatPrice] = useState<number>(getPrice(amount, bitcoinPrice))

  const clearCustomAmount = () => {
    onChange(0)
  }

  const updateCustomAmount = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) {
      clearCustomAmount()
    } else {
      setCustomFiatPrice(getPrice(num, bitcoinPrice))
      onChange(num)
    }
  }
  const updateCustomFiatAmount = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) {
      clearCustomAmount()
    } else {
      setCustomFiatPrice(num)
      onChange(convertFiatToSats(num, bitcoinPrice))
    }
  }

  useEffect(() => {
    setCustomFiatPrice(getPrice(amount, bitcoinPrice))
  }, [amount, bitcoinPrice])

  return { updateCustomAmount, clearCustomAmount, customFiatPrice, updateCustomFiatAmount, displayCurrency }
}
