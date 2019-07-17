# harpo.js
A comprehensive format-preserving-encryption (FPE) implementation for Node.js.
Built entirely using ES5 vanilla JavaScript and Node's
[crypto](https://nodejs.org/api/crypto.html) module.

> An implementation of contemporary format-preserving-encryption algorithms for Node.js environments.

[Format-preserving-encryption](https://en.wikipedia.org/wiki/Format-preserving_encryption) is a type of encryption in 
which the format (length, characters, etc) of the output/ciphertext is the same as that of the input.

This library implements FPE algorithms from: 
- A [prefix cipher](https://en.wikipedia.org/wiki/Format-preserving_encryption#FPE_from_a_prefix_cipher). 
This implementation is useful for small domain sizes.
- A recursive [cycle walking algorithm](https://en.wikipedia.org/wiki/Format-preserving_encryption#FPE_from_cycle_walking).
- A [Feistel network](https://en.wikipedia.org/wiki/Format-preserving_encryption#FPE_from_a_Feistel_network).

## Changelog
- v0.1 (alpha) build released.
- `prefix-cipher` is the only FPE algorithm available.
- Cipher initialization with custom domain options available.
- Basic encryption and decryption functions available.

## Further scope
- Implement robust working versions of the `cycle-walking` and `feistel-network` FPE algorithms.
- Functionality to compare the performance and time of the 
FPE algorithms using varying input sizes/presets.

## Dependencies
- Node.js version 6 and above
- JavaScript :)
- crypto

## Installation
> npm install harpo
## Usage

### cipher(key, iv, fpe_algorithm, cipher_algorithm, domain_options)

To initialize a FPE cipher using harpo.js:

- `key`: (**required**) a key used in the underlying block cipher.
- `iv`:(**required**) an iv (initialization vector) used in the underlying block cipher. Some block ciphers may not require it. 
In that case, it can be set to *null* or *''*.
- `fpe_algorithm`: (**optional**, **default**: 'prefix-cipher') The FPE algorithm to be used by the cipher:
  - `prefix-cipher`: A prefix cipher algorithm (**currently available**).
  - `cycle-walking`: A cycle walking algorithm (**in development**).
  - `feistel-network`: A Feistel network implementation (**in development**).
  
- `cipher_algorithm`: (**optional**, **default**: _aes-256-cbc_) The underlying block cipher algorithm used. 
Similar to [crypto.createCipheriv()](https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options) 
of Node's `crypto` module. 

- `domain_options`: (**optional**, **default**: `{}`, sets domain as the characters of the input text) An object that 
contains the configuration specifying the FPE cipher's domain. The object contains the following fields:

  - *type*: (**string**) The type of the domain configuration to use:
    - `default`: Default config. Uses the characters of the input text to be encrypted as the domain.
    - `input`: Use only the characters specified in the *domain* field as the domain.
    - `preset`: Use one of the many presets available for the specified FPE algorithm.
    - `ascii-range`: Use set(s) of specified ASCII characters as the domain.
    
  - *domain*: (**string**/**array**) The domain field. The value of this field depends on the *type* field:
    - When `type: default`, the domain field or its value is not considered.
    - When `type: input`, the domain field contains the characters to be used as the domain.
    - When `type: preset`, the domain field contains one of the many preset domains available:
      - Presets for `prefix-cipher`:
        - `"numeric"`: `1234567890`
        - `"alphalower"`: `abcdefghijklmnopqrstuvwxyz`
        - `"alphaupper"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
      - Presets for `cycle-walking`:
        - `"numeric"`: `1234567890`
        - `"alphalower"`: `abcdefghijklmnopqrstuvwxyz`
        - `"alphaupper"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
        - `"alphanumeric"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`, `abcdefghijklmnopqrstuvwxyz`, `1234567890`
        - `"text"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`, `abcdefghijklmnopqrstuvwxyz`, `1234567890`, `. ,;:/?!@#$%&*()[]-'"`
      - Presets for `feistel-network`:
        - `"numeric"`: `1234567890`
        - `"alphalower"`: `abcdefghijklmnopqrstuvwxyz`
        - `"alphaupper"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
        - `"alphanumeric"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`, `abcdefghijklmnopqrstuvwxyz`, `1234567890`
        - `"text"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`, `abcdefghijklmnopqrstuvwxyz`, `1234567890`, `. ,;:/?!@#$%&*()[]-'"`
        - `"jwt"`: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`, `abcdefghijklmnopqrstuvwxyz`, `1234567890`, `._-`
        - `"sha-512"`: `abcdef`, `0123456789` 
        
    - When `type: ascii-range`, the domain field contains an array/string that specifies a 
    set(s) of ASCII characters for the domain.
  - *residual_chars*: (**boolean**) Toggle that indicates whether to include any characters of 
  the input text that are not in the configured domain. Only considered when domain *type* isn't `input`.
  - *additional_chars*: (**array**) An array that contains any additional characters to be 
  included in the domain. Array can contain a few entries of multiple-character 
  strings (```['abcd', '1264', ...]```) or many entries of single-character 
  strings (```['a', 'b', 'c', 'd', '1', '2', '6', '4', ...]```). Independent of the domain *type* value.
  
#### Examples:

Initializing a cipher with the default FPE algorithm (prefix-cipher), default encryption algorithm (aes-256-cbc), 
and default domain config:

```js
var crypto = require('crypto');
var harpo = require('harpo');

var key = crypto.randomBytes(16).toString('hex');
var iv = crypto.randomBytes(8).toString('hex');

var cipher = harpo.cipher(key, iv);
```

Initializing a cipher with the default FPE algorithm (prefix-cipher), DES encryption algorithm (des-ecb), and 
default domain config:

```js
var crypto = require('crypto');
var harpo = require('harpo');

var key = crypto.randomBytes(4).toString('hex');

var cipher = harpo.cipher(key, '', 'prefix-cipher', 'des-ecb');
```

Initializing a cipher with the default FPE algorithm (prefix-cipher), default encryption algorithm (aes-256-cbc), 
and a custom domain ([A-E]):

```js
var crypto = require('crypto');
var harpo = require('harpo');

var key = crypto.randomBytes(16).toString('hex');
var iv = crypto.randomBytes(8).toString('hex');

var options = {
  type: 'input',
  domain: 'ABCDE'
};

var cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', options);
```

Initializing a cipher with the default FPE algorithm (prefix-cipher), default encryption algorithm (aes-256-cbc), 
and a custom domain ([alphalower] preset) that includes any out-of-domain characters in the input text.

```js
var crypto = require('crypto');
var harpo = require('harpo');

var key = crypto.randomBytes(16).toString('hex');
var iv = crypto.randomBytes(8).toString('hex');

var options = {
  type: 'preset',
  domain: 'alphalower',
  residual_chars: true
};

var cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', options);
```

Initializing a cipher with the default FPE algorithm (prefix-cipher), default encryption algorithm (aes-256-cbc), 
and a custom domain (ascii-ranges of [65-90] and [97-122]) that includes any out-of-domain characters in the 
input text and uses additional symbol characters.

```js
var crypto = require('crypto');
var harpo = require('harpo');

var key = crypto.randomBytes(16).toString('hex');
var iv = crypto.randomBytes(8).toString('hex');

var options = {
  type: 'ascii-range',
  domain: ['65-90', '97-122'],
  residual_chars: true,
  additional_chars: ['!@#$%^', '&*', '(', ')']
};

var cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', options);
```

---

### cipher.encrypt(text) and cipher.decrypt(text)

To encrypt and decrypt a string of text using an initialized FPE cipher. **Note**: the same FPE cipher must be 
used for successful encryption and decryption.
  
```js
var crypto = require('crypto');
var harpo = require('../lib/core/index');

var key = crypto.randomBytes(16).toString('hex');
var iv = crypto.randomBytes(8).toString('hex');

var cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
    type: 'default',
    domain: ''
});

cipher.encrypt('bumblebee');
// 'ubmuleuee'

cipher.decrypt('ubmuleuee');
// 'bumblebee'

// reinitializing cipher with new domain options
cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
    type: 'preset',
    domain: 'numeric',
    residual_chars: true
});

cipher.encrypt('TheCowJumpedOverTheMoon');
// 'OTvpoh0d34v91nvuOTvroo5'

cipher.decrypt('OTvpoh0d34v91nvuOTvroo5');
// 'TheCowJumpedOverTheMoon'

// reinitializing cipher with new domain options
cipher = harpo.cipher(key, iv, 'prefix-cipher', 'aes-256-cbc', {
    type: 'input',
    domain: '123456abcdef',
    additional_chars: [',./defgh']
});

cipher.encrypt('3314526');
// '44dh.ec'

cipher.decrypt('44dh.ec');
// '3314526'
```

---

### presets()

To obtain a list of domain presets of each FPE algorithm.

```js
var harpo = require('../lib/core/index');

harpo.presets();
// prefix-cipher:
//        numeric: 1234567890
//        alphalower: abcdefghijklmnopqrstuvwxyz
//        alphaupper: ABCDEFGHIJKLMNOPQRSTUVWXYZ
// cycle-walking:
//        numeric: 1234567890
//        alphalower: abcdefghijklmnopqrstuvwxyz
//        alphaupper: ABCDEFGHIJKLMNOPQRSTUVWXYZ
// ...
```

## License

MIT © Baalateja Kataru
