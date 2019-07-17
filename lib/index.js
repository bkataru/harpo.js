var crypto = require('crypto');
'use strict';

module.exports = (function () {
    var domain_presets = {
        'alphanumeric': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890'],
        'text': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890',
            ' ', '.', ',', ';', ':', '/', '?', '!', '@', '#', '$', '%', '&', '*', '(', ')', '[', ']', '-'],
        'jwt': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '.', '_', '-'],
        'sha-512': ['abcdef', '0123456789']
    };

    function get_presets () {
        var preset_string = [];

        Object.keys(domain_presets).forEach(function (key) {
            var domain_string = [];
            for(var i = 0; i < domain_presets[key].length; i++) {
                domain_string.push(domain_presets[key][i]);
            }
            domain_string = domain_string.join(',');
            preset_string.push(key + ': ' + domain_string);
        });
        preset_string = preset_string.join('\n');

        return preset_string;
    }

    function char_encrypt(char, key, iv, algorithm) {
        var cipher = crypto.createCipheriv(algorithm, key, iv);
        var crypted = cipher.update(char, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    function shuffle_domain(domain, key, iv, algorithm) {
        // create a permutation of domain
        var sorted = domain
            .map(function (char) { return char; })
            .sort(function(char1, char2) {
                return char_encrypt(char1, key, iv, algorithm).localeCompare(char_encrypt(char2, key, iv, algorithm));
            });

        var encrypted_table = {};
        var decrypted_table = {};

        for(var i = 0; i < domain.length; i++)
        {
            encrypted_table[domain[i]] = sorted[i];
            decrypted_table[sorted[i]] = domain[i];
        }

        return {
            encrypted_table: encrypted_table,
            decrypted_table: decrypted_table
        }
    }

    function cipher (key, iv, algorithm, domain_options) {
        var cipher_obj = {};

        if (!key) throw new Error(`'key' is required`);
        if (!algorithm) algorithm = 'aes-256-cbc';

        try {
            var ciph = crypto.createCipheriv(algorithm, key, iv);
        } catch (error) {
            throw new Error(error.message);
        }

        cipher_obj.key = key;
        cipher_obj.iv = iv;
        cipher_obj.algorithm = algorithm;

        var input_chars;
        var residual_chars;
        var domain = [];

        if(domain_options) {
            if(domain_options.input_chars) {
                input_chars = true;
            }
            else {
                if(domain_options.ascii_range) {
                    var ascii_range = domain_options.ascii_range;

                    if(!ascii_range.start) throw new Error(`'ASCII range 'start' argument required (domain_options)`);
                    if(!ascii_range.end) throw new Error(`'ASCII range 'end' argument required (domain_options)`);
                    if(!(typeof ascii_range.start == 'number')) throw new Error(`'ASCII range 'start' argument must be a number (domain_options)`);
                    if(!(typeof ascii_range.end == 'number')) throw new Error(`'ASCII range 'end' argument must be a number (domain_options)`);

                    for(var index = ascii_range.start; index <= ascii_range.end; index++) {
                        domain.push(String.fromCharCode(index));
                    }
                }
                else if(domain_options.preset) {
                    var domain_set = domain_presets[domain_options.preset];
                    if(!domain_set) throw new Error(`Invalid 'preset' provided (domain_options)`);

                    for(var index1 = 0; index1 < domain_set.length; index1++) {
                        for(var index2 = 0; index2 < domain_set[index1].length; index2++) {
                            domain.push(domain_set[index1].split('')[index2]);
                        }
                    }
                }

                if(domain_options.residual_chars) {
                    residual_chars = true;
                }
            }

            if(domain_options.additional_chars) {
                let additional_set = domain_options.additional_chars;
                if(Array.isArray(additional_set)) {
                    for(var index1 = 0; index1 < additional_set.length; index1++) {
                        for(var index2 = 0; index2 < additional_set[index1].length; index2++) {
                            domain.push(additional_set[index1].split('')[index2]);
                        }
                    }
                }
                else if(typeof additional_set == 'string') {
                    for(var index1 = 0; index1 < additional_set.length; index1++) {
                        domain.push(additional_set.split('')[index1]);
                    }
                }
            }

            if(domain.length == 0) {
                var default_set = domain_presets['alphanumeric'];

                for(var i = 0; i < default_set.length; i++) {
                    for(var j = 0; j < default_set[i].length; j++) {
                        domain.push(default_set[i].split('')[j]);
                    }
                }
            }
        }
        else
        {
            input_chars = true;
        }

        let shuffle_result = shuffle_domain(domain, cipher_obj.key, cipher_obj.iv, cipher_obj.algorithm);

        cipher_obj.domain_data = {
            domain: domain,
            input_chars: input_chars,
            residual_chars: residual_chars,
            encrypted_table: shuffle_result.encrypted_table,
            decrypted_table: shuffle_result.decrypted_table
        };

        cipher_obj.encrypt = encrypt;
        cipher_obj.decrypt = decrypt;

        return cipher_obj;
    }

    function validate(text, result, domain) {
        if (text.length !== result.length) {
            var out_of_domain = [];
            for(var i = 0; i < text.length; i++) {
                if(!domain.includes(text.split('')[i]) && !out_of_domain.includes(text.split('')[i]))
                    out_of_domain.push(text.split('')[i]);
            }

            throw new Error(
                `some of the input characters are not in the cipher's domain: [${out_of_domain}]`
            );
        }
    }

    function use_custom_domain(text, cipher_obj, residual) {
        var domain = residual ? cipher_obj.domain_data.domain : [];

        for(var i = 0; i < text.length; i++) {
            if(!domain.includes(text.split('')[i])) domain.push(text.split('')[i]);
        }
        domain = domain.sort(function (char1, char2) {
           return char1.localeCompare(char2);
        });
        var shuffle_result = shuffle_domain(domain, cipher_obj.key, cipher_obj.iv, cipher_obj.algorithm);

        cipher_obj.domain_data.domain = domain;
        cipher_obj.domain_data.encrypted_table = shuffle_result.encrypted_table;
        cipher_obj.domain_data.decrypted_table = shuffle_result.decrypted_table;
    }

    function encrypt(text) {
        if (typeof text !== 'string') {
            throw new Error('input is not a string');
        }

        if(this.domain_data.input_chars) {
            use_custom_domain(text, this, false);
        }
        else if(this.domain_data.residual_chars) {
            use_custom_domain(text, this, true);
        }

        let cipher_obj = this;
        const encrypted = text
            .split('')
            .map(function (char) {
                return cipher_obj.domain_data.encrypted_table[char];
            })
            .join('');

        validate(text, encrypted, cipher_obj.domain_data.domain);
        return encrypted;
    }

    function decrypt(text) {
        if (typeof text !== 'string') {
            throw new Error('input is not a string');
        }

        let cipher_obj = this;
        const decrypted = text
            .split('')
            .map(function (char) {
                return cipher_obj.domain_data.decrypted_table[char];
            })
            .join('');

        validate(text, decrypted, cipher_obj.domain_data.domain);
        return decrypted;
    }

    return {
        cipher: cipher,
        presets: get_presets
    }
})();