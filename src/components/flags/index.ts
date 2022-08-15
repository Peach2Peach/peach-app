import ES from './es.svg'
import FR from './fr.svg'
import GB from './gb.svg'
import NL from './nl.svg'
import PT from './pt.svg'

const Flags = {
  ES,
  FR,
  GB,
  NL,
  PT,
  DE: null,
  IT: null,
  CH: null,
  UK: null,
  SE: null,
  US: null,
}

export type FlagType = keyof typeof Flags

export default Flags
