import es from './es.svg'
import fr from './fr.svg'
import gb from './gb.svg'
import nl from './nl.svg'
import pt from './pt.svg'

const Flags = {
  es,
  fr,
  gb,
  nl,
  pt,
}

export type FlagType = keyof typeof Flags

export default Flags
