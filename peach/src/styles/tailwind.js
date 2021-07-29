import { create } from 'tailwind-react-native-classnames'
import styles from './styles.json'
import fontStyles from './font-styles.json'
import GetWindowDimensions from '../hooks/GetWindowDimensions'

const tailwind = create({
  ...styles,
  ...fontStyles
})

const tw = cls => tailwind(cls)
tw.md = cls => GetWindowDimensions().width > 600 ? tailwind(cls) : ''
tw.lg = cls => GetWindowDimensions().width > 1200 ? tailwind(cls) : ''

export default tw