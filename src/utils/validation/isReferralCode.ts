export const isReferralCode = (code: string) => code.length > 0 && /^[A-Z0-9]{1,16}$/u.test(code)
