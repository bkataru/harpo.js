var harpo = require('../lib/core/index');

var key = require('crypto').randomBytes(16).toString('hex');
var iv = require('crypto').randomBytes(8).toString('hex');

var cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
    type: 'default',
    domain: ''
});

console.log(cipher.encrypt('bumblebee'));
console.log(cipher.decrypt(cipher.encrypt('bumblebee')));

// reinitializing cipher with new domain options
cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
    type: 'preset',
    domain: 'numeric',
    residual_chars: true
});

console.log(cipher.encrypt('TheCowJumpedOverTheMoon'));
console.log(cipher.decrypt(cipher.encrypt('TheCowJumpedOverTheMoon')));

// reinitializing cipher with new domain options
cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
    type: 'input',
    domain: '123456abcdef',
    additional_chars: [',./defgh']
});

console.log(cipher.encrypt('3314526'));
console.log(cipher.decrypt(cipher.encrypt('3314526')));


