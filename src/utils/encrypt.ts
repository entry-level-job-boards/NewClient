import CryptoJS from 'crypto-js';

export const encryptData = (data: object): string => {
    const key = process.env.REACT_APP_ENCRYPTION_KEY;
    if (!key) throw new Error('Missing REACT_APP_ENCRYPTION_KEY in .env');
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

export const decryptData = (encryptedData: string): object => {
    const key = process.env.REACT_APP_ENCRYPTION_KEY;
    if (!key) throw new Error('Missing REACT_APP_ENCRYPTION_KEY in .env');
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
};