import { useMemo, useState } from 'react'
import { premiumBounds } from './PremiumInput'
import { PercentageInput } from './inputs/PercentageInput'

type Props = {
  premium: number
  setPremium: (newPremium: number) => void
}

export function PremiumTextInput ({ premium, setPremium }: Props) {
  const [displayPremium, setDisplayPremium] = useState(premium.toString())

  const displayValue = useMemo(() => {
    const displayPremiumAsNumber = convertDisplayPremiumToNumber(displayPremium)
    if (premium === displayPremiumAsNumber) return displayPremium
    return premium.toString()
  }, [premium, displayPremium])

  const changePremium = (value: string) => {
    const newPremium = enforcePremiumFormat(value)
    setDisplayPremium(newPremium)
    setPremium(convertDisplayPremiumToNumber(newPremium))
  }

  return <PercentageInput value={displayValue} onChange={changePremium} />
}

function convertDisplayPremiumToNumber (displayPremium: string) {
  const asNumberType = Number(enforcePremiumFormat(displayPremium))
  if (isNaN(asNumberType)) return 0
  return asNumberType
}

function enforcePremiumFormat (premium: string) {
  if (premium === '') return ''
  if (premium === '0') return '0'

  const number = Number(premium)
  if (isNaN(number)) return String(premium).trim()
  if (number < premiumBounds.min) return '-21'
  if (number > premiumBounds.max) return '21'
  return String(premium).trim()
    .replace(/^0/u, '')
}
