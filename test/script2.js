const crypto = require('crypto');
const harpo = require('../lib/core/index');

let key = crypto.randomBytes(16).toString('hex');
let iv = crypto.randomBytes(8).toString('hex');
// default: domain of encryption text
// input: provided domain
var new_options = {
    type: 'input', // default, input, preset, ascii-range
    domain: '12345',
    residual_chars: true,
    additional_chars: []
};

let cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', new_options);

let text = 'BEEBEE';
console.log(text);
console.log(cipher.encrypt(text));
console.log(cipher.decrypt(cipher.encrypt(text)));

