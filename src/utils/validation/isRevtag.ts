export const isRevtag = (revtag: string) => revtag !== '@' && /^@[a-z0-9]{3,16}$/u.test(revtag)
