import { encryptData, decryptData } from './encrypt';

export const secureFetch = async (url: string, method: string, data?: any) => {
    const encrypted = encryptData(data || {});

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: encrypted }),
    });

    const text = await response.text();

    try {
        const json = JSON.parse(text);

        // ✅ Decrypt only if it's encrypted
        if (json.encrypted) {
            return decryptData(json.encrypted);
        }

        // ✅ Return plain object if not encrypted
        return json;
    } catch (err) {
        console.error('❌ secureFetch decryption error:', err);
        throw new Error('Decryption failed or response invalid');
    }
};