import { encryptData, decryptData } from './encrypt';

export const secureFetch = async (url: string, method: string, data?: any) => {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_ENCRYPTION_KEY,
        },
    };

    if (method !== 'GET' && method !== 'HEAD' && data) {
        const { password, ...rest } = data;

        options.body = JSON.stringify({
            payload: encryptData(rest), // Encrypt everything except the password
            password // Send plaintext password separately
        });
    }

    const response = await fetch(url, options);
    const text = await response.text();

    try {
        const json = JSON.parse(text);
        if (json.encrypted) {
            return decryptData(json.encrypted);
        } else if (json.message) {
            throw new Error(json.message);
        }
        return json;
    } catch (err) {
        console.error('❌ secureFetch decryption error:', err);
        throw new Error('Decryption failed or response invalid');
    }
};