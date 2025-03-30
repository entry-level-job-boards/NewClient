import { encryptData, decryptData } from './encrypt';

export const secureFetch = async (url: string, method: string, data?: any) => {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (method !== 'GET' && method !== 'HEAD' && data) {
        const skipEncryption = url.includes('/api/user'); // 👈 customize this however you want

        options.body = skipEncryption
            ? JSON.stringify(data)
            : JSON.stringify({ payload: encryptData(data) });
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