const crypto = require('crypto');
const harpo = require('./index');

let key = crypto.randomBytes(16).toString('hex');
let iv = crypto.randomBytes(8).toString('hex');

var options = {
    input_chars: false,
    residual_chars: false,
    preset: 'jwt',
    ascii_range: {
        start: 97,
        end: 112
    },
    additional_chars: []
};

let cipher = harpo.cipher(key, iv, 'aes-256-cbc', {
    input_chars: false,
    residual_chars: false,
});

let text = 'i/am**baala';
console.log(text);
console.log(cipher.encrypt(text));
console.log(cipher.decrypt(cipher.encrypt(text)));