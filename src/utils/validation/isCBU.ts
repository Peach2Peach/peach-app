const isValidBankCode = (bankCode: string) => {
  if (!bankCode || bankCode.length !== 8) return false
  const digits = bankCode.split('').map((d) => Number(d))
  const bank = digits.slice(0, 3)
  const checksumOne = digits[3]
  const branch = digits.slice(4, 7)
  const checksumTwo = digits[7]

  const sum = bank[0] * 7 + bank[1] * 1 + bank[2] * 3 + checksumOne * 9 + branch[0] * 7 + branch[1] * 1 + branch[2] * 3
  const diff = (10 - (sum % 10)) % 10

  return diff === checksumTwo
}
const isValidAccount = (accountNumber: string) => {
  if (!accountNumber || accountNumber.length !== 14) return false

  const digits = accountNumber.split('').map((d) => Number(d))

  const sum
    = digits[0] * 3
    + digits[1] * 9
    + digits[2] * 7
    + digits[3] * 1
    + digits[4] * 3
    + digits[5] * 9
    + digits[6] * 7
    + digits[7] * 1
    + digits[8] * 3
    + digits[9] * 9
    + digits[10] * 7
    + digits[11] * 1
    + digits[12] * 3
  const diff = (10 - (sum % 10)) % 10
  const checksum = digits[13]

  return diff === checksum
}

export const isCBU = (cbu: string) => {
  if (!cbu || cbu.length !== 22) return false
  const bankCode = cbu.substring(0, 8)
  const accountCode = cbu.substring(8, 22)
  return isValidBankCode(bankCode) && isValidAccount(accountCode)
}
