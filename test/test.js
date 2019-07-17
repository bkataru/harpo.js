const crypto = require('crypto');
const harpo = require('../lib/core/index');

// var new_options = {
//     type: 'input', // default, input, preset, ascii-range
//     domain: '12345',
//     residual_chars: true,
//     additional_chars: []
// };

function test_module(key, iv, fpe_algorithm, cipher_algorithm, domain_options) {
    try {
        var cipher = harpo.cipher(key, iv, fpe_algorithm, cipher_algorithm, domain_options);

        var text = 'thecowjumpsoverthemoon';
        console.log('Input text: ', text);
        console.log('Domain: ', cipher.domain_data.domain.join(''));
        console.log('Encrypted text: ', cipher.encrypt(text));
        console.log('Decrypted text: ', cipher.decrypt(cipher.encrypt(text)));
    } catch (error) {
        return error.message;
    }
    return "No Errors";
}

(function () {
    console.log("RUNNING TESTS.....");
    console.log();

    `==============================================================================================================================`;
    console.log('1. Test name: Missing key');
    console.log(test_module(undefined, crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', undefined));
    console.log();

    console.log('2. Test name: Missing iv');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), undefined,
        'prefix-cipher', 'aes-256-cbc', undefined));
    console.log();

    `==============================================================================================================================`;
    console.log('3. Test name: Invalid key length');
    console.log(test_module(crypto.randomBytes(6).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', undefined));
    console.log();

    console.log('4. Test name: Invalid iv length');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(5).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', undefined));
    console.log();

    `==============================================================================================================================`;
    console.log('5. Test name: Invalid key format');
    console.log(test_module(13123123, crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', undefined));
    console.log();

    console.log('6. Test name: Invalid iv format');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), 12312312,
        'prefix-cipher', 'aes-256-cbc', undefined));
    console.log();

    `==============================================================================================================================`;
    console.log('7. Test name: Missing fpe_algorithm');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        undefined, 'aes-256-cbc', undefined));
    console.log();

    console.log('8. Test name: Invalid fpe_algorithm');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'not-a-valid-input', 'aes-256-cbc', undefined));
    console.log();

    `==============================================================================================================================`;
    console.log('9. Test name: Missing cipher_algorithm');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', undefined, undefined));
    console.log();

    console.log('10. Test name: Invalid cipher_algorithm');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'not-a-valid-input', undefined));
    console.log();

    `==============================================================================================================================`;
    console.log('11. Test name: Default domain options');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {}));
    console.log();

    console.log('12. Test name: Default domain options 2');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'default'
        }));
    console.log();

    console.log('13. Test name: Default domain options with domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'default',
            domain: '0123u0123'
        }));
    console.log();

    console.log('14. Test name: Default domain options with domain, residual_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'default',
            domain: '0123u0123',
            residual_chars: true
        }));
    console.log();

    console.log('15. Test name: Default domain options with domain, residual_chars, additional_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'default',
            domain: '0123u0123',
            residual_chars: true,
            additional_chars: ['!@#$%^&*()']
        }));
    console.log();

    `==============================================================================================================================`;
    console.log('16. Test name: Input domain option');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input'
        }));
    console.log();

    console.log('17. Test name: Input domain option with domain parameter length 0');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: []
        }));
    console.log();

    console.log('18. Test name: Input domain option with invalid domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: ['oiajdsa']
        }));
    console.log();

    console.log('19. Test name: Input domain option with domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: '12345'
        }));
    console.log();

    console.log('20. Test name: Input domain option with domain, residual_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: '12345',
            residual_chars: true
        }));
    console.log();

    console.log('21. Test name: Input domain option with domain, residual_chars, additional_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: '12345',
            residual_chars: true,
            additional_chars: ['!@#$%^&']
        }));
    console.log();

    console.log('22. Test name: Input domain option with domain, additional_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: '12345',
            additional_chars: ['!@#$%^&']
        }));
    console.log();

    console.log('23. Test name: Input domain option with domain, additional_chars parameters to fill up for missing domain chars');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: '12345',
            additional_chars: ['thecowjumpsoverthemoon']
        }));
    console.log();

    console.log('24. Test name: Input domain option with domain, additional_chars parameters 2');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'input',
            domain: '12345',
            additional_chars: ['thecowjumpsoverthemoon']
        }));
    console.log();

    `==============================================================================================================================`;
    console.log('25. Test name: Preset domain option');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset'
        }));
    console.log();

    console.log('26. Test name: Preset domain option with domain parameter length 0');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: []
        }));
    console.log();

    console.log('27. Test name: Preset domain option with invalid domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: ['oiajdsa']
        }));
    console.log();

    console.log('28. Test name: Preset domain option with invalid domain parameter 2');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'oiajsdoas'
        }));
    console.log();

    console.log('29. Test name: Preset domain option with text-valid domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'alphanumeric'
        }));
    console.log();

    console.log('30. Test name: Preset domain option with text-invalid domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'numeric'
        }));
    console.log();

    console.log('31. Test name: Preset domain option with domain, residual_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'numeric',
            residual_chars: true
        }));
    console.log();

    console.log('32. Test name: Preset domain option with domain, residual_chars, additional_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'numeric',
            residual_chars: true,
            additional_chars: ['!@#$%^&']
        }));
    console.log();

    console.log('33. Test name: Preset domain option with domain, additional_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'numeric',
            additional_chars: ['!@#$%^&']
        }));
    console.log();

    console.log('34. Test name: Preset domain option with domain, additional_chars parameters to fill up for missing domain chars');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'numeric',
            additional_chars: ['thecowjumpsoverthemoon']
        }));
    console.log();

    console.log('35. Test name: Preset domain option with domain, additional_chars parameters 2');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'preset',
            domain: 'alphanumeric',
            additional_chars: ['thecowjumpsoverthemoon']
        }));
    console.log();

    `==============================================================================================================================`;
    console.log('36. Test name: ASCII-range domain option');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range'
        }));
    console.log();

    console.log('37. Test name: ASCII-range domain option with domain parameter length 0');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: []
        }));
    console.log();

    console.log('38. Test name: ASCII-range domain option with invalid domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: ['oiajdsa']
        }));
    console.log();

    console.log('39. Test name: ASCII-range domain option with invalid domain parameter 2');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: 'oiajsdoas'
        }));
    console.log();

    console.log('40. Test name: ASCII-range domain option with text-valid domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: '97-123'
        }));
    console.log();

    console.log('41. Test name: ASCII-range domain option with text-invalid domain parameter');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: ['150-170']
        }));
    console.log();

    console.log('42. Test name: ASCII-range domain option with multiple valid domain ranges');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: ['65-90', '97-122']
        }));
    console.log();

    console.log('43. Test name: ASCII-range domain option with multiple valid and invalid domain ranges');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: ['65-90', '97-122', '77_44']
        }));
    console.log();

    console.log('44. Test name: ASCII-range domain option with domain, residual_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: '65-90',
            residual_chars: true
        }));
    console.log();

    console.log('45. Test name: ASCII-range domain option with domain, residual_chars, additional_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: '65-90',
            residual_chars: true,
            additional_chars: ['!@#$%^&']
        }));
    console.log();

    console.log('46. Test name: ASCII-range domain option with domain, additional_chars parameters');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: '65-90',
            additional_chars: ['!@#$%^&']
        }));
    console.log();

    console.log('47. Test name: ASCII-range domain option with domain, additional_chars parameters to fill up for missing domain chars');
    console.log(test_module(crypto.randomBytes(16).toString('hex'), crypto.randomBytes(8).toString('hex'),
        'prefix-cipher', 'aes-256-cbc', {
            type: 'ascii-range',
            domain: '65-90',
            additional_chars: ['thecowjumpsoverthemoon']
        }));
    console.log();
})();

