const crypto = require('crypto');
const base64 = require('base-64');

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(base64.encode(text));
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('hex');
}

function decrypt(text) {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return base64.decode(decrypted.toString());
}

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjZmExNjcwNDlkOTIyMjBmYjQ2OTViYSIsIm5hbWUiOiJiYWFsYXRlamEiLCJlbWFpbCI6ImthdmVzYnRlamFAZ21haWwuY29tIiwiYXBpX2hhc2giOiIyNTBaIiwiaWF0IjoxNTYxMTU0Nzc0fQ.VM1XHCUl8EThLMPfGoQHWSmvkJjnBasASzIODButo3M"
var hw = encrypt(token);
console.log(hw);
console.log();
console.log(decrypt(hw));
console.log(token.localeCompare(decrypt(hw)));