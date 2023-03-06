type Side = 'left' | 'right'

type PadStringProps = {
  string: string
  length: number
  char?: string
  side?: Side
}

/**
 * @description Method to pad string with given character by given length
 * @param props parameters
 * @param props.string the string to pad
 * @param props.length length to pad to
 * @param [props.char] character to pad with
 * @param [props.side] side to pad to
 * @returns padded string
 */
export const padString = ({ string = '', length, char = '0', side = 'left' }: PadStringProps): string => {
  while (string.length < length) {
    if (side === 'left') {
      string = char + string
    } else {
      string += char
    }
  }
  return string
}
