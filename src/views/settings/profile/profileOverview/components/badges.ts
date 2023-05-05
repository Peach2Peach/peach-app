import { IconType } from '../../../../../assets/icons'
import { badgeIconMap } from '../../../../../constants'

export const badges: [IconType, Medal][] = (Object.keys(badgeIconMap) as Medal[]).map((key) => [badgeIconMap[key], key])
