import CryptoJS from 'crypto-js';

export const encryptData = (data: object): string => {
    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    if (!key) throw new Error("Missing VITE_ENCRYPTION_KEY in .env");

    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

export const decryptData = (encryptedData: string): any => {
    const key = import.meta.env.VITE_ENCRYPTION_KEY;
    if (!key) throw new Error("Missing VITE_ENCRYPTION_KEY in .env");

    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};