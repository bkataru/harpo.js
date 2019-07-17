const crypto = require('crypto');
let domain_internal = '123456789'.split('');
// improve:
// 1. use domain of text
// 2. custom additional chars to domain
// 3. ascii ranges to domain
// 4. use createCiperiv than createCipher
module.exports = function ({
                               key,
                               iv,
                               algorithm = 'aes-256-cbc',
                               domain = domain_internal
                           }) {
    if (!key) {
        throw new Error('`key` is required');
    }
    else if(!iv) {
        throw new Error('`iv` is required')
    }

    function enc(text) {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    // create a permutation of domain
    const sorted = domain
        .map(c => c)
        .sort((c1, c2) => enc(c1).localeCompare(enc(c2)));
    const encTable = {};
    const decTable = {};

    for (let i in domain) {
        encTable[domain[i]] = sorted[i];
        decTable[sorted[i]] = domain[i];
    }

    function validate(text, result) {
        if (text.length !== result.length) {
            throw new Error(
                `some of the input characters are not in the cipher's domain: [${domain}]`
            );
        }
    }

    function encrypt(text) {
        if (typeof text !== 'string') {
            throw new Error('input is not a string');
        }
        const encrypted = text
            .split('')
            .map(c => encTable[c])
            .join('');
        validate(text, encrypted);
        return encrypted;
    }

    function decrypt(text) {
        if (typeof text !== 'string') {
            throw new Error('input is not a string');
        }
        const decrypted = text
            .split('')
            .map(c => decTable[c])
            .join('');
        validate(text, decrypted);
        return decrypted;
    }

    return {encrypt, decrypt};
};