const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const secret = '8ff013305617a7525d6a20eeba5830a09f43206a482a3c556025781fd6d87cb5a286967a85da9d78f1f2b1c078cea99cbf4949b736b2bd44aca02fdaf3323eb9';
const base64 = require('base-64');

console.log(randomstring.generate(24).length);

let payload = {
    id: randomstring.generate(24),
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    api_hash: randomstring.generate(4)
};

let api_key = jwt.sign(payload, secret);
console.log(api_key);