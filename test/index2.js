// const crypto = require('crypto');
// const harpo = require('../lib/core/index');
//
// var key = crypto.randomBytes(16).toString('hex');
// var iv = crypto.randomBytes(8).toString('hex');
//
// var cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
//     type: 'default',
//     domain: ''
// });
//
// cipher.encrypt('bumblebee');
// // 'ubmuleuee'
//
// cipher.decrypt('ubmuleuee');
// // 'bumblebee'
//
// // reinitializing cipher with new domain options
// cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
//     type: 'preset',
//     domain: 'numeric',
//     residual_chars: true
// });
//
// cipher.encrypt('TheCowJumpedOverTheMoon');
// // 'OTvpoh0d34v91nvuOTvroo5'
//
// cipher.decrypt('OTvpoh0d34v91nvuOTvroo5');
// // 'TheCowJumpedOverTheMoon'
//
// // reinitializing cipher with new domain options
// cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
//     type: 'input',
//     domain: '123456abcdef',
//     additional_chars: [',./defgh']
// });
//
// cipher.encrypt('3314526');
// // '44dh.ec'
//
// cipher.decrypt('44dh.ec');
// // '3314526'

var harpo = require('../lib/core/index');

console.log(harpo.presets());
