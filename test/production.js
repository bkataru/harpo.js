const crypto = require('crypto');
let api_encryption = {
    init: function(key, iv, algorithm, domain) {
        if(!key) throw new Error('`key` is required');
        if(!iv) throw new Error('`iv` is required');
        this.key = key;
        this.iv = iv;
        this.algorithm = algorithm ? algorithm : 'aes-256-cbc';
        this.domain = domain ? domain : this.default_domain();
        this.permute();
    },
    default_domain: function () {
        let domains = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', '1234567890', '.', '_', '-'];
        domains.push(domains[0].toLowerCase());

        let net_domain = [];
        for(let domain of domains)
        {
            for(let elem of domain.split(''))
            {
                net_domain.push(elem);
            }
        }

        return net_domain;
    },
    enc: function (text) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    permute: function() {
        const sorted = this.domain
            .map(c => c)
            .sort((c1, c2) => this.enc(c1).localeCompare(this.enc(c2)));

        this.encTable = [];
        this.decTable = [];

        for (let i in this.domain) {
            this.encTable[this.domain[i]] = sorted[i];
            this.decTable[sorted[i]] = this.domain[i];
        }
    },
    validate: function (text, result) {
        if (text.length !== result.length) {
            throw new Error(
                `some of the input characters are not in the cipher's domain: [${this.domain}]`
            );
        }
    },
    encrypt: function(text) {
        if (typeof text !== 'string') {
            throw new Error('input is not a string');
        }
        const encrypted = text
            .split('')
            .map(c => this.encTable[c])
            .join('');
        this.validate(text, encrypted);

        return encrypted;
    },
    decrypt: function(text) {
        if (typeof text !== 'string') {
            throw new Error('input is not a string');
        }
        const decrypted = text
            .split('')
            .map(c => this.decTable[c])
            .join('');
        this.validate(text, decrypted);

        return decrypted;
    }
};

api_encryption.init('fefe9ac7deed4f033b1657642e9a56aa','099faeba7a7050e5');

var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IktoRXo0QjNxOFhrajFpWENldE9FMnlwSSIsIm5hbWUiOiJKb2huIERvZSIsImVtYWlsIjoiam9obmRvZUBnbWFpbC5jb20iLCJhcGlfaGFzaCI6IndhNVkiLCJpYXQiOjE1NjIzODYzNDF9.Ue4jM7vgg0B_uVoXOYuBoe3Sw9UA8n5UGxcjBksoJp4';

var hw = api_encryption.encrypt(token);
console.log(hw);
console.log();
console.log(api_encryption.decrypt(hw));
console.log(token.localeCompare(api_encryption.decrypt(hw)));