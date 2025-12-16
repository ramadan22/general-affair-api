/* eslint-disable @typescript-eslint/no-explicit-any */
export function getBearerToken(req) {
    const authHeader = req.headers['authorization']; // <- object biasa
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return null;
    return authHeader.split(' ')[1];
}
export function removeObjectKeys(obj, keysToRemove) {
    const result = { ...obj };
    for (const key of keysToRemove) {
        delete result[key];
    }
    return result;
}
