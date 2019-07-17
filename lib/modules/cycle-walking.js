const crypto = require('crypto');
var exports = {};

var domain_presets = exports.domain_presets = {
    'numeric': ['1234567890'],
    'alphalower': ['abcdefghijklmnopqrstuvwxyz'],
    'alphaupper': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
    'alphanumeric': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890'],
    'text': ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', `. ,;:/?!@#$%&*()[]-'"`]
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

module.exports = exports;