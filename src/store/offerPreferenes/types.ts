import z from 'zod'
export const CurrencyType = z.enum(['europe', 'latinAmerica', 'other'])
export type CurrencyType = z.infer<typeof CurrencyType>
