const crypto = require('crypto');
const harpo = require('../lib/core/index');

/*
* 'text': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890',
        ' ', '.', ',', ';', ':', '/', '?', '!', '@', '#', '$', '%', '&', '*', '(', ')', '[', ']', '-', "'", '"'],
    'jwt': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '.', '_', '-'],
    'sha-512': ['abcdef', '0123456789']
*  */

let key = crypto.randomBytes(16).toString('hex');
let iv = crypto.randomBytes(8).toString('hex');
// default: domain of encryption text
// input: provided domain
var new_options = {
    type: 'default', // default, input, preset, ascii-range
    domain: '',
    residual_chars: true,
    additional_chars: []
};

let cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', new_options);

let text = 'i/am**baala';
console.log(text);
console.log(cipher.encrypt(text));
console.log(cipher.decrypt(cipher.encrypt(text)));