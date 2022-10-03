import CH from './ch.svg'
import ES from './es.svg'
import FR from './fr.svg'
import GB from './gb.svg'
import IT from './it.svg'
import NL from './nl.svg'
import PT from './pt.svg'

const Flags = {
  CH,
  DE: null,
  ES,
  FR,
  GB,
  IT,
  NL,
  PT,
  SE: null,
  UK: null,
  US: null
}

export type FlagType = keyof typeof Flags

export default Flags
