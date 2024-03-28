export const isCPFValid = (cpf: string): boolean => {
    const strippedCPF = cpf.replace(/\D/gu, ''); // Remove non-digit characters

    // Check for invalid lengths or all digits being the same
    if (strippedCPF.length !== 11 || /^(.)\1+$/u.test(strippedCPF)) return false;

    let remainder, sum;
    sum = 0;

    // Calculate first check digit
    for (let i = 1; i <= 9; i++) sum += parseInt(strippedCPF.substring(i-1, i), 10) * (11 - i);
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11))  remainder = 0;
    if (remainder !== parseInt(strippedCPF.substring(9, 10), 10) ) return false;

    sum = 0;
    // Calculate second check digit
    for (let i = 1; i <= 10; i++) sum += parseInt(strippedCPF.substring(i-1, i), 10) * (12 - i);
    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11))  remainder = 0;
    return remainder === parseInt(strippedCPF.substring(10, 11), 10);
};
