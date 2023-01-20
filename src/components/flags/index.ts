import CH from './ch.svg'
import ES from './es.svg'
import FR from './fr.svg'
import GB from './gb.svg'
import IT from './it.svg'
import NL from './nl.svg'
import PT from './pt.svg'
import DE from './de.svg'
import BE from './be.svg'
import CA from './ca.svg'
import PL from './pl.svg'
import SI from './si.svg'

const Flags = {
  CH,
  DE,
  ES,
  FR,
  GB,
  IT,
  NL,
  PT,
  BE,
  CA,
  PL,
  SI,
  SE: null,
  UK: null,
  US: null,
}

export type FlagType = keyof typeof Flags

export default Flags
