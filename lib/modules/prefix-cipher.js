const crypto = require('crypto');
var exports = {};

var domain_presets = exports.domain_presets = {
    'numeric': ['1234567890'],
    'alphanumeric': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890']
};

exports.algorithm_presets = function () {
    var preset_string = [];

    Object.keys(domain_presets).forEach(function (key) {
        var domain_string = [];
        for(var i = 0; i < domain_presets[key].length; i++) {
            domain_string.push(domain_presets[key][i]);
        }
        domain_string = domain_string.join(',');
        preset_string.push('\t' + key + ': ' + domain_string);
    });
    preset_string = preset_string.join('\n');

    return preset_string;
};

var char_encrypt = function (char, key, iv, algorithm) {
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var crypted = cipher.update(char, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

var shuffle_domain = exports.shuffle_domain = function (domain, key, iv, algorithm) {
    // create a permutation of domain
    var sorted = domain
        .map(function (char) { return char; })
        .sort(function(char1, char2) {
            return char_encrypt(char1, key, iv, algorithm).localeCompare(char_encrypt(char2, key, iv, algorithm));
        });

    var encrypted_table = {};
    var decrypted_table = {};

    for(var i = 0; i < domain.length; i++) {
        encrypted_table[domain[i]] = sorted[i];
        decrypted_table[sorted[i]] = domain[i];
    }

    return {
        encrypted_table: encrypted_table,
        decrypted_table: decrypted_table
    }
};

exports.use_custom_domain = function (text, cipher_obj, residual) {
    var domain = residual ? cipher_obj.domain_data.domain : [];

    for(var i = 0; i < text.length; i++) {
        if(domain.indexOf(text.split('')[i]) === -1)
            domain.push(text.split('')[i]);
    }

    domain = domain.sort();
    var shuffle_result = shuffle_domain(domain, cipher_obj.key, cipher_obj.iv, cipher_obj.cipher_algorithm);

    cipher_obj.domain_data.domain = domain;
    cipher_obj.domain_data.encrypted_table = shuffle_result.encrypted_table;
    cipher_obj.domain_data.decrypted_table = shuffle_result.decrypted_table;
};

exports.validate = function (text, result, domain) {
    if (text.length !== result.length) {
        var out_of_domain = [];
        for(var i = 0; i < text.length; i++) {
            if(domain.indexOf(text.split('')[i]) === -1 && out_of_domain.indexOf(text.split('')[i]) === -1)
                out_of_domain.push(text.split('')[i]);
        }

        throw new Error(
            `some of the input characters are not in the cipher's domain: [${out_of_domain}]`
        );
    }
};

module.exports = exports;