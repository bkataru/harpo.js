const crypto = require('crypto');

let key = crypto.randomBytes(16).toString('hex');
let iv = crypto.randomBytes(8).toString('hex');

function char_encrypt(char) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let crypted = cipher.update(char, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

console.log(char_encrypt('d'));

let domain = 'abcdefghijklmo'.split('');
let sorted = domain
    .map(function (char) { return char; })
    .sort(function(char1, char2) { return char_encrypt(char1).localeCompare(char_encrypt(char2)); });

var encrypted_table = {};
var decrypted_table = {};

for(var i = 0; i < domain.length; i++)
{
    encrypted_table[domain[i]] = sorted[i];
    decrypted_table[sorted[i]] = domain[i];
}

console.log(encrypted_table);
console.log(decrypted_table);
