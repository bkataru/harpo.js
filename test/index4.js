additional_set = ['abc', '', '', '.', '_', '-'];

let domain = [];
for(var index1 = 0; index1 < additional_set.length; index1++) {
    for(var index2 = 0; index2 < additional_set[index1].length; index2++) {
        domain.push(additional_set[index1].split('')[index2]);
    }
}

console.log(domain);