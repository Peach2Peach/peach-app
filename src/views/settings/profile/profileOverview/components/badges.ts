import { IconType } from '../../../../../assets/icons'
import { badgeIconMap } from '../../../../../constants'
import { keys } from '../../../../../utils/object'

export const badges: [IconType, Medal][] = keys(badgeIconMap).map((key) => [badgeIconMap[key], key])
