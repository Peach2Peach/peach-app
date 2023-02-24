import BE from './be.svg'
import CA from './ca.svg'
import CH from './ch.svg'
import DE from './de.svg'
import ES from './es.svg'
import FR from './fr.svg'
import GB from './gb.svg'
import GR from './gr.svg'
import IT from './it.svg'
import NL from './nl.svg'
import PL from './pl.svg'
import PT from './pt.svg'
import SI from './si.svg'
import FI from './fi.svg'

const Flags = {
  BE,
  CA,
  CH,
  DE,
  ES,
  FR,
  FI,
  GB,
  GR,
  IT,
  NL,
  PL,
  PT,
  SE: null,
  SI,
  US: null,
}

export type FlagType = keyof typeof Flags

export default Flags
