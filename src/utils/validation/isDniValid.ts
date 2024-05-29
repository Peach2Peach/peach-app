export const isDniValid = (dni: string): boolean => {
    if (!/^\d+$/u.test(dni)) return false;
    // Proceed with length validation
    return dni.length >= 7 && dni.length <= 9;
};
